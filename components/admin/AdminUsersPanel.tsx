"use client";

import { useState } from "react";
import { Plus, ShieldAlert, Trash2 } from "lucide-react";
import type { AdminRecord, AdminRole } from "@/lib/admin/types";

export function AdminUsersPanel({
  admins,
  currentEmail,
}: {
  admins: AdminRecord[];
  currentEmail: string;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [status, setStatus] = useState("");

  const request = async (input: RequestInfo | URL, init?: RequestInit) => {
    setStatus("Saving...");
    const response = await fetch(input, init);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus(payload.error || "Request failed.");
      return;
    }

    setStatus("Saved.");
    window.location.reload();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          request("/admin/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, role }),
          });
        }}
        className="rounded-2xl border border-white/80 bg-white p-6 text-als-blue shadow-xl shadow-black/10"
      >
        <div className="grid h-11 w-11 place-items-center rounded-full bg-als-red/10 text-als-red">
          <Plus className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-black">Add admin</h2>
        <p className="mt-2 text-sm leading-6 text-als-muted">
          Only Super Admins can grant access. Add Gmail accounts that should manage ALS content.
        </p>
        <label className="mt-5 block">
          <span className="text-sm font-bold">Gmail address</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            placeholder="name@gmail.com"
            className="mt-2 h-11 w-full rounded-xl border border-als-line px-4 text-sm font-semibold focus:border-als-red focus:outline-none focus:ring-4 focus:ring-als-red/10"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-bold">Role</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as AdminRole)}
            className="mt-2 h-11 w-full rounded-xl border border-als-line px-4 text-sm font-semibold focus:border-als-red focus:outline-none focus:ring-4 focus:ring-als-red/10"
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </label>
        <button
          type="submit"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-als-red px-5 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          Add admin
        </button>
        {status ? <p className="mt-4 text-sm font-semibold text-als-red">{status}</p> : null}
      </form>

      <div className="rounded-2xl border border-white/80 bg-white p-6 text-als-blue shadow-xl shadow-black/10">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-als-red/10 text-als-red">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Admin accounts</h2>
            <p className="mt-2 text-sm leading-6 text-als-muted">
              Role changes and removals are sent to server-guarded APIs and then enforced again by
              Supabase RLS.
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-als-line">
          {admins.map((admin) => (
            <div
              key={admin.email}
              className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_11rem_auto] md:items-center"
            >
              <div>
                <p className="font-black text-als-blue">{admin.email}</p>
                <p className="mt-1 text-xs text-als-muted">
                  Added {new Date(admin.addedAt).toLocaleDateString()} by {admin.addedBy || "seed"}
                </p>
              </div>
              <select
                value={admin.role}
                onChange={(event) =>
                  request(`/admin/api/users/${encodeURIComponent(admin.email)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: event.target.value }),
                  })
                }
                className="h-10 rounded-full border border-als-line px-3 text-sm font-bold"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
              <button
                type="button"
                disabled={admin.email === currentEmail}
                onClick={() =>
                  request(`/admin/api/users/${encodeURIComponent(admin.email)}`, {
                    method: "DELETE",
                  })
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-als-line px-4 text-sm font-bold text-als-red transition hover:border-als-red/35 hover:bg-als-red/5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
