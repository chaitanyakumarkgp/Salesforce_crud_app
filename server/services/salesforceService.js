const axios = require("axios");

function createSalesforceClient(session) {
  if (!session || !session.accessToken || !session.instanceUrl) {
    throw new Error("Salesforce session not available");
  }

  return axios.create({
    baseURL: `${session.instanceUrl}/services/data/${process.env.SALESFORCE_API_VERSION}`,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json"
    }
  });
}

async function queryRecords(session, soql) {
  const client = createSalesforceClient(session);

  const response = await client.get("/query", {
    params: {
      q: soql
    },
    headers: {
      "Sforce-Query-Options": "batchSize=200"
    }
  });

  return response.data;
}

async function createRecord(session, objectName, data) {
  const client = createSalesforceClient(session);

  const response = await client.post(
    `/sobjects/${objectName}`,
    data
  );

  return response.data;
}

async function updateRecord(session, objectName, recordId, data) {
  const client = createSalesforceClient(session);

  const response = await client.patch(
    `/sobjects/${objectName}/${recordId}`,
    data
  );

  return response.data;
}

async function deleteRecord(session, objectName, recordId) {
  const client = createSalesforceClient(session);

  const response = await client.delete(
    `/sobjects/${objectName}/${recordId}`
  );

  return response.data;
}

module.exports = {
  queryRecords,
  createRecord,
  updateRecord,
  deleteRecord
};