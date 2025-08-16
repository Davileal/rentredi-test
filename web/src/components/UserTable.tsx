import { formatTzOffset, mapLink } from "../utils/formatters";

export default function UserTable({ users, onEdit, onDelete }) {
  if (!users?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500 italic">
        No users yet. Create your first one above.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="w-full border-collapse">
        <thead className="bg-slate-50">
          <tr className="text-left">
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">
              Name
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">
              Zip
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">
              Latitude
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">
              Longitude
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">
              Timezone
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => {
            const link = mapLink(u.latitude, u.longitude);
            return (
              <tr key={u.id} className={i % 2 ? "bg-white" : "bg-slate-50/30"}>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.zipCode}</td>
                <td className="px-4 py-3">{u.latitude ?? "-"}</td>
                <td className="px-4 py-3">
                  {u.longitude ?? "-"}
                  {link && (
                    <>
                      {" "}
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        title="Open in OpenStreetMap"
                        className="text-xs text-blue-600"
                      >
                        (map)
                      </a>
                    </>
                  )}
                </td>
                <td className="px-4 py-3">{formatTzOffset(u.timezone)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(u)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(u)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
