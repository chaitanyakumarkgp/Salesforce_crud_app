export const OBJECT_CONFIG = {
  Account: {
    fields: ["Id", "Name", "Industry", "Phone", "Website"],
    requiredFields: ["Name"]
  },

  Opportunity: {
    fields: ["Id", "Name", "StageName", "Amount", "CloseDate"],
    requiredFields: ["Name", "StageName", "CloseDate"]
  },

  Lead: {
    fields: ["Id", "FirstName", "LastName", "Company", "Status", "Email", "Phone"],
    requiredFields: ["LastName", "Company"]
  },

  Contact: {
    fields: ["Id", "FirstName", "LastName", "Email", "Phone", "AccountId"],
    requiredFields: ["LastName"]
  },

  Case: {
    fields: ["Id", "CaseNumber", "Subject", "Status", "Priority", "Origin"],
    requiredFields: ["Status"]
  }
};