const express = require("express");
const router = express.Router();

const OBJECTS = require("../config/objects");
const requireAuth = require("../middleware/authMiddleware");

const {
  queryRecords,
  createRecord,
  updateRecord,
  deleteRecord
} = require("../services/salesforceService");

router.use(requireAuth);

router.get("/objects", (req, res) => {
  res.json(
    Object.keys(OBJECTS).map((key) => ({
      label: key,
      apiName: OBJECTS[key].apiName,
      fields: OBJECTS[key].fields
    }))
  );
});

router.get("/records/:objectName", async (req, res) => {
  try {
    const { objectName } = req.params;

    const page = parseInt(req.query.page || "1", 10);

    const config = OBJECTS[objectName];

    if (!config) {
      return res.status(400).json({
        message: "Unsupported Salesforce object"
      });
    }

    const offset = (page - 1) * 20;

    const fields = config.fields.join(", ");

    const soql = `
      SELECT ${fields}
      FROM ${config.apiName}
      ORDER BY CreatedDate DESC
      LIMIT 20
      OFFSET ${offset}
    `;

    const data = await queryRecords(
      req.session.salesforce,
      soql
    );

    res.json({
      records: data.records,
      page,
      pageSize: 20,
      totalSize: data.totalSize,
      hasMore: data.records.length === 20
    });
  } catch (error) {
    console.error(
      "Fetch error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message:
        error.response?.data?.[0]?.message ||
        "Failed to fetch records"
    });
  }
});

router.post("/records/:objectName", async (req, res) => {
  try {
    const { objectName } = req.params;

    const config = OBJECTS[objectName];

    if (!config) {
      return res.status(400).json({
        message: "Unsupported Salesforce object"
      });
    }

    const cleanData = {};

    for (const field of config.createFields) {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== ""
      ) {
        cleanData[field] = req.body[field];
      }
    }

    const result = await createRecord(
      req.session.salesforce,
      config.apiName,
      cleanData
    );

    res.status(201).json(result);
  } catch (error) {
    console.error(
      "Create error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message:
        error.response?.data?.[0]?.message ||
        "Failed to create record"
    });
  }
});

router.put("/records/:objectName/:id", async (req, res) => {
  try {
    const { objectName, id } = req.params;

    const config = OBJECTS[objectName];

    if (!config) {
      return res.status(400).json({
        message: "Unsupported Salesforce object"
      });
    }

    const cleanData = {};

    for (const field of config.editableFields) {
      if (req.body[field] !== undefined) {
        cleanData[field] = req.body[field];
      }
    }

    const result = await updateRecord(
      req.session.salesforce,
      config.apiName,
      id,
      cleanData
    );

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error(
      "Update error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message:
        error.response?.data?.[0]?.message ||
        "Failed to update record"
    });
  }
});

router.delete("/records/:objectName/:id", async (req, res) => {
  try {
    const { objectName, id } = req.params;

    const config = OBJECTS[objectName];

    if (!config) {
      return res.status(400).json({
        message: "Unsupported Salesforce object"
      });
    }

    await deleteRecord(
      req.session.salesforce,
      config.apiName,
      id
    );

    res.json({
      success: true
    });
  } catch (error) {
    console.error(
      "Delete error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message:
        error.response?.data?.[0]?.message ||
        "Failed to delete record"
    });
  }
});

module.exports = router;