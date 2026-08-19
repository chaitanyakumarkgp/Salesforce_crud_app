function ObjectSelector({
  selectedObject,
  setSelectedObject
}) {
  return (
    <div className="selector-container">
      <label>Salesforce Object</label>

      <select
        value={selectedObject}
        onChange={(e) =>
          setSelectedObject(e.target.value)
        }
      >
        <option value="Account">Account</option>
        <option value="Opportunity">
          Opportunity
        </option>
        <option value="Lead">Lead</option>
        <option value="Contact">Contact</option>
        <option value="Case">Case</option>
      </select>
    </div>
  );
}

export default ObjectSelector;