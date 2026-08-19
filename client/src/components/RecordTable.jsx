function RecordTable({
  records,
  fields,
  onEdit,
  onDelete,
  onLoadMore,
  loading,
  hasMore
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field}>{field}</th>
            ))}

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr key={record.Id}>
              {fields.map((field) => (
                <td key={field}>
                  {record[field] ?? "-"}
                </td>
              ))}

              <td>
                <button
                  onClick={() => onEdit(record)}
                  className="edit-button"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(record)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div className="loading">
          Loading records...
        </div>
      )}

      {!loading && hasMore && (
        <button
          className="load-more"
          onClick={onLoadMore}
        >
          Load next 20
        </button>
      )}

      {!hasMore && records.length > 0 && (
        <div className="end-message">
          No more records
        </div>
      )}
    </div>
  );
}

export default RecordTable;