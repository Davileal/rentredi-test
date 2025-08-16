import { useMemo, useState } from "react";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import { useUsers } from "./hooks/useUsers";

export default function App() {
  const { users, isLoading, error, createUser, updateUser, deleteUser } =
    useUsers();

  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const base = [...users];
    const result = q
      ? base.filter(
          (u) =>
            (u.name || "").toLowerCase().includes(q) ||
            (u.zipCode || "").toLowerCase().includes(q)
        )
      : base;
    return result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [users, filter]);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleCreate = async (payload) => {
    try {
      await createUser(payload);
      showToast("User created");
    } catch (e) {
      showToast(e.message || "Create failed", "error");
    }
  };

  const handleSave = async (payload) => {
    try {
      await updateUser(editing.id, payload);
      setEditing(null);
      showToast("User updated");
    } catch (e) {
      showToast(e.message || "Update failed", "error");
    }
  };

  const askDelete = (user) => {
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      showToast("User deleted");
    } catch (e) {
      showToast(e.message || "Delete failed", "error");
    } finally {
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">RentRedi</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create, edit and delete users. Lat/Lon/Timezone are fetched by the
          API.
        </p>
      </header>

      {/* Search + Form */}
      <div className="grid gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by name or zip…"
          aria-label="search"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
        />

        <UserForm
          onSubmit={editing ? handleSave : handleCreate}
          editingUser={editing}
          onCancel={() => setEditing(null)}
        />
      </div>

      {/* Table */}
      <section className="mt-4">
        {isLoading ? (
          <div className="text-slate-600">Loading…</div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
            Failed to load users: {String(error?.message || error)}
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            onEdit={setEditing}
            onDelete={askDelete}
          />
        )}
      </section>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 rounded-xl border px-4 py-2 text-sm shadow-md ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-900"
              : "border-cyan-200 bg-cyan-50 text-cyan-900"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={confirmOpen}
        title="Delete user"
        description={
          userToDelete
            ? `Are you sure you want to delete "${userToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this item?"
        }
        onClose={() => {
          setConfirmOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
