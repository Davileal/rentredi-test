import { useEffect, useState } from "react";

export default function UserForm({ onSubmit, editingUser, onCancel }) {
  const [name, setName] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || "");
      setZipCode(editingUser.zipCode || "");
    } else {
      setName("");
      setZipCode("");
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !zipCode.trim()) return;
    onSubmit({ name: name.trim(), zipCode: zipCode.trim() });
    setName("");
    setZipCode("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="user-form"
      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="m-0 text-lg font-semibold">
        {editingUser ? "Edit User" : "Create User"}
      </h2>

      <label className="grid gap-1">
        <span className="text-xs text-slate-600">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
          aria-label="name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs text-slate-600">Zip Code</span>
        <input
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="10001"
          required
          aria-label="zipCode"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {editingUser ? "Save" : "Create"}
        </button>

        {editingUser && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
