import { useEffect, useState } from "react";

function RecordForm({
  objectName,
  fields,
  requiredFields = [],
  record,
  onSubmit,
  onClose
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialData = {};

    fields.forEach((field) => {
      if (field !== "Id" && field !== "CaseNumber") {
        initialData[field] =
          record?.[field] ?? "";
      }
    });

    setFormData(initialData);
  }, [fields, record]);

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const editableFields = fields.filter(
    (field) =>
      field !== "Id" &&
      field !== "CaseNumber"
  );

  const placeholders = {
    AccountId: "e.g. 001XXXXXXXXXXXXXXXXX"
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>
            {record
              ? `Edit ${objectName}`
              : `Create ${objectName}`}
          </h2>

          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {editableFields.map((field) => (
            <div className="form-group" key={field}>
              <label>
                {field}
                {requiredFields.includes(field) && (
                  <span className="required-star"> *</span>
                )}
              </label>

              <input
                type={
                  field === "Amount"
                    ? "number"
                    : field === "CloseDate"
                    ? "date"
                    : "text"
                }
                value={formData[field] ?? ""}
                placeholder={placeholders[field] || ""}
                required={requiredFields.includes(field)}
                onChange={(e) =>
                  handleChange(
                    field,
                    e.target.value
                  )
                }
              />
            </div>
          ))}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit">
              {record ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordForm;