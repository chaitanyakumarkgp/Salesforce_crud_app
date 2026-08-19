function requireAuth(req, res, next) {
  if (!req.session.salesforce) {
    return res.status(401).json({
      message: "Not authenticated with Salesforce"
    });
  }

  next();
}

module.exports = requireAuth;