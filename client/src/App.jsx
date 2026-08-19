import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import ObjectSelector from "./components/ObjectSelector";
import RecordTable from "./components/RecordTable";
import RecordForm from "./components/RecordForm";
import InfiniteScroll from "./components/InfiniteScroll";
import ConfirmDialog from "./components/ConfirmDialog";

import {
  getAuthStatus,
  login,
  logout,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord
} from "./services/api";

import { OBJECT_CONFIG } from "./config/objects";

function App() {
  const [authenticated, setAuthenticated] =
    useState(false);

  const [selectedObject, setSelectedObject] =
    useState("Account");

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingRecord, setEditingRecord] =
    useState(null);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [confirmRecord, setConfirmRecord] =
    useState(null);

  const [totalSize, setTotalSize] = useState(0);

  const config = OBJECT_CONFIG[selectedObject];
  const fields = config.fields;
  const requiredFields = config.requiredFields;

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (authenticated) {
      setPage(1);
      setRecords([]);
      setHasMore(true);

      loadRecords(1);
    }
  }, [selectedObject, authenticated]);

  async function checkAuthentication() {
    try {
      const response = await getAuthStatus();

      setAuthenticated(
        response.data.authenticated
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function loadRecords(
    requestedPage = 1
  ) {
    if (requestedPage > 1 && !hasMore) {
      return;
    }

    try {
      if (requestedPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError("");

      const response = await getRecords(
        selectedObject,
        requestedPage
      );

      const newRecords =
        response.data.records;

      if (requestedPage === 1) {
        setRecords(newRecords);
      } else {
        setRecords((previous) => [
          ...previous,
          ...newRecords
        ]);
      }

      setPage(requestedPage);
      setHasMore(response.data.hasMore);
      if (requestedPage === 1) {
        setTotalSize(response.data.totalSize);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load records"
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function handleCreate(data) {
    try {
      setError("");

      await createRecord(
        selectedObject,
        data
      );

      setModalOpen(false);

      await loadRecords();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create record"
      );
    }
  }

  async function handleUpdate(data) {
    try {
      setError("");

      await updateRecord(
        selectedObject,
        editingRecord.Id,
        data
      );

      setEditingRecord(null);
      setModalOpen(false);

      await loadRecords();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update record"
      );
    }
  }

  function handleDelete(record) {
    setConfirmRecord(record);
  }

  async function confirmDelete() {
    try {
      await deleteRecord(
        selectedObject,
        confirmRecord.Id
      );

      setRecords((previous) =>
        previous.filter(
          (item) => item.Id !== confirmRecord.Id
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete record"
      );
    } finally {
      setConfirmRecord(null);
    }
  }

  async function handleLogout() {
    await logout();
    setAuthenticated(false);
    setRecords([]);
  }

  function openCreate() {
    setEditingRecord(null);
    setModalOpen(true);
  }

  function openEdit(record) {
    setEditingRecord(record);
    setModalOpen(true);
  }

  if (!authenticated) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="salesforce-icon">
            ☁
          </div>

          <h1>Salesforce CRUD Manager</h1>

          <p>
            Manage Salesforce records from a
            custom web application.
          </p>

          <button
            className="login-button large"
            onClick={login}
          >
            Login with Salesforce
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar
        authenticated={authenticated}
        onLogin={login}
        onLogout={handleLogout}
      />

      <main className="container">
        <section className="page-header">
          <div>
            <h2>Salesforce Records</h2>
            <p>
              {totalSize > 0
                ? `${totalSize} total records • ${records.length} loaded`
                : "Create, view, update and delete Salesforce data."}
            </p>
          </div>

          <button
            className="create-button"
            onClick={openCreate}
          >
            + Create {selectedObject}
          </button>
        </section>

        <ObjectSelector
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <RecordTable
          records={records}
          fields={fields}
          onEdit={openEdit}
          onDelete={handleDelete}
          onLoadMore={loadRecords}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
        />

        <InfiniteScroll
          loading={loadingMore}
          hasMore={hasMore}
          onLoadMore={() =>
            loadRecords(page + 1)
          }
        />

        {confirmRecord && (
          <ConfirmDialog
            message={`Are you sure you want to delete this ${selectedObject}?`}
            onConfirm={confirmDelete}
            onCancel={() => setConfirmRecord(null)}
          />
        )}

        {modalOpen && (
          <RecordForm
            objectName={selectedObject}
            fields={fields}
            requiredFields={requiredFields}
            record={editingRecord}
            onSubmit={
              editingRecord
                ? handleUpdate
                : handleCreate
            }
            onClose={() => {
              setModalOpen(false);
              setEditingRecord(null);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;