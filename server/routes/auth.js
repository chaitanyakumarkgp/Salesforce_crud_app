const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const router = express.Router();

/**
 * Generate a PKCE code verifier.
 */
function generateCodeVerifier() {
  return crypto.randomBytes(64).toString("base64url");
}

/**
 * Generate the S256 PKCE code challenge.
 */
function generateCodeChallenge(codeVerifier) {
  return crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
}


/**
 * Start Salesforce OAuth login.
 */
router.get("/login", (req, res) => {
  // Generate PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge =
    generateCodeChallenge(codeVerifier);

  // Store verifier in the server session.
  // We need it later when exchanging the authorization code.
  req.session.codeVerifier = codeVerifier;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SALESFORCE_CLIENT_ID,
    redirect_uri:
      process.env.SALESFORCE_CALLBACK_URL,

    scope: "api refresh_token offline_access",

    // PKCE
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  });

  const authorizationUrl =
    `${process.env.SALESFORCE_LOGIN_URL}` +
    `/services/oauth2/authorize?` +
    params.toString();

  console.log(
    "Redirecting to Salesforce OAuth..."
  );

  res.redirect(authorizationUrl);
});


/**
 * Salesforce OAuth callback.
 */
router.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send(
        "Authorization code missing"
      );
    }

    // Retrieve the verifier created during /login
    const codeVerifier =
      req.session.codeVerifier;

    if (!codeVerifier) {
      return res.status(400).send(
        "PKCE code verifier missing or session expired"
      );
    }

    const params = new URLSearchParams({
      grant_type: "authorization_code",

      code,

      client_id:
        process.env.SALESFORCE_CLIENT_ID,

      client_secret:
        process.env.SALESFORCE_CLIENT_SECRET,

      redirect_uri:
        process.env.SALESFORCE_CALLBACK_URL,

      // PKCE
      code_verifier: codeVerifier
    });

    const response = await axios.post(
      `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`,
      params.toString(),
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        }
      }
    );

    // Store Salesforce authentication details
    // in the server-side session.
    req.session.salesforce = {
      accessToken:
        response.data.access_token,

      refreshToken:
        response.data.refresh_token,

      instanceUrl:
        response.data.instance_url
    };

    // Remove the PKCE verifier after successful exchange.
    delete req.session.codeVerifier;

    console.log(
      "Salesforce OAuth authentication successful"
    );

    res.redirect(
      process.env.CLIENT_URL
    );

  } catch (error) {
    console.error(
      "OAuth error:",
      error.response?.data ||
        error.message
    );

    res.status(500).send(
      "Salesforce authentication failed"
    );
  }
});


/**
 * Check authentication status.
 */
router.get("/status", (req, res) => {
  res.json({
    authenticated:
      Boolean(req.session.salesforce)
  });
});


/**
 * Logout.
 */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({
      success: true
    });
  });
});


module.exports = router;