const OBJECTS = {
  Account: {
    apiName: "Account",
    fields: [
      "Id",
      "Name",
      "Industry",
      "Phone",
      "Website"
    ],
    editableFields: [
      "Name",
      "Industry",
      "Phone",
      "Website"
    ],
    createFields: [
      "Name",
      "Industry",
      "Phone",
      "Website"
    ]
  },

  Opportunity: {
    apiName: "Opportunity",
    fields: [
      "Id",
      "Name",
      "StageName",
      "Amount",
      "CloseDate"
    ],
    editableFields: [
      "Name",
      "StageName",
      "Amount",
      "CloseDate"
    ],
    createFields: [
      "Name",
      "StageName",
      "Amount",
      "CloseDate"
    ]
  },

  Lead: {
    apiName: "Lead",
    fields: [
      "Id",
      "FirstName",
      "LastName",
      "Company",
      "Status",
      "Email",
      "Phone"
    ],
    editableFields: [
      "FirstName",
      "LastName",
      "Company",
      "Status",
      "Email",
      "Phone"
    ],
    createFields: [
      "FirstName",
      "LastName",
      "Company",
      "Status",
      "Email",
      "Phone"
    ]
  },

  Contact: {
    apiName: "Contact",
    fields: [
      "Id",
      "FirstName",
      "LastName",
      "Email",
      "Phone",
      "AccountId"
    ],
    editableFields: [
      "FirstName",
      "LastName",
      "Email",
      "Phone",
      "AccountId"
    ],
    createFields: [
      "FirstName",
      "LastName",
      "Email",
      "Phone",
      "AccountId"
    ]
  },

  Case: {
    apiName: "Case",
    fields: [
      "Id",
      "CaseNumber",
      "Subject",
      "Status",
      "Priority",
      "Origin"
    ],
    editableFields: [
      "Subject",
      "Status",
      "Priority",
      "Origin"
    ],
    createFields: [
      "Subject",
      "Status",
      "Priority",
      "Origin"
    ]
  }
};

module.exports = OBJECTS;