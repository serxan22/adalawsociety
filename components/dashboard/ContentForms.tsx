"use client";

import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { currentUser } from "@/data/current-user";
import { canPublish, getDefaultContentStatus } from "@/lib/auth/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormKind = "article" | "news";
type Status = "draft" | "pending" | "published";

type FormState = {
  title: string;
  summary: string;
  excerpt: string;
  category: string;
  tags: string;
  coverImage: string;
  content: string;
  citations: string;
  status: Status;
};

const baseState: FormState = {
  title: "",
  summary: "",
  excerpt: "",
  category: "",
  tags: "",
  coverImage: "",
  content: "",
  citations: "",
  status: getDefaultContentStatus(currentUser.role) as Status,
};

export function ContentForm({ kind }: { kind: FormKind }) {
  const [form, setForm] = useState<FormState>(baseState);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const canPublishDirectly = canPublish(currentUser.role);

  const title = kind === "article" ? "Write Article" : "Create News";
  const description =
    kind === "article"
      ? "Articles require a summary before drafting. Citations are optional in this preview but visible in the workflow."
      : "News drafts should use verified facts, clear sourcing, and confirmed public details.";

  const statusOptions = useMemo<Status[]>(
    () => (canPublishDirectly ? ["draft", "pending", "published"] : ["draft", "pending"]),
    [canPublishDirectly],
  );

  const update = (key: keyof FormState, value: string) => {
    setSaved(false);
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = [
      !form.title.trim() ? "Title is required." : "",
      kind === "article" && !form.summary.trim() ? "Article summary is required." : "",
      kind === "news" && !form.excerpt.trim() ? "News excerpt is required." : "",
      !form.content.trim() ? "Content is required." : "",
      form.status === "published" && !canPublishDirectly
        ? "Only editors and admins can publish directly."
        : "",
    ].filter(Boolean);

    setErrors(nextErrors);
    setSaved(nextErrors.length === 0);
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-als-line bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-als-line pb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-als-red">Local preview form</p>
          <h2 className="mt-2 text-3xl font-bold text-als-blue">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-als-muted">{description}</p>
        </div>
        <div className="rounded-lg border border-als-line bg-als-blue-soft p-4 text-sm text-als-muted">
          <p className="font-semibold text-als-blue">Role behavior</p>
          <p className="mt-1">
            ALS team can submit drafts or pending items. Editors and admins can publish.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        <Field label="Title" required>
          <Input value={form.title} onChange={(event) => update("title", event.target.value)} />
        </Field>

        {kind === "article" ? (
          <Field label="Summary" required>
            <Textarea
              value={form.summary}
              onChange={(event) => update("summary", event.target.value)}
              placeholder="Required before the author writes the full article."
            />
          </Field>
        ) : (
          <Field label="Excerpt" required>
            <Textarea
              value={form.excerpt}
              onChange={(event) => update("excerpt", event.target.value)}
            />
          </Field>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Category">
            <Input value={form.category} onChange={(event) => update("category", event.target.value)} />
          </Field>
          {kind === "article" ? (
            <Field label="Tags">
              <Input
                value={form.tags}
                onChange={(event) => update("tags", event.target.value)}
                placeholder="research, advocacy, moot court"
              />
            </Field>
          ) : null}
          <Field label="Status">
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
              className="h-11 w-full rounded-lg border border-als-line bg-white px-4 text-sm font-semibold text-als-blue shadow-sm focus:border-als-red focus:outline-none focus:ring-4 focus:ring-als-red/10"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Cover image URL">
          <Input
            value={form.coverImage}
            onChange={(event) => update("coverImage", event.target.value)}
            placeholder="/images/placeholders/event-1.jpg"
          />
        </Field>

        <Field label="Content" required>
          <Textarea
            value={form.content}
            onChange={(event) => update("content", event.target.value)}
            className="min-h-56"
          />
        </Field>

        {kind === "article" ? (
          <Field label="Citations">
            <Textarea
              value={form.citations}
              onChange={(event) => update("citations", event.target.value)}
              placeholder="One citation per line or JSON for future CMS import."
            />
          </Field>
        ) : null}
      </div>

      {errors.length > 0 ? (
        <div className="mt-6 rounded-lg border border-als-red/25 bg-als-red/5 p-4 text-sm text-als-red">
          <div className="flex gap-2 font-semibold">
            <ShieldAlert className="h-4 w-4" />
            Fix these fields
          </div>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {saved ? (
        <div className="mt-6 flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Draft validated locally. Connect Supabase Auth/RLS before saving real content.
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit">{form.status === "published" ? "Validate publish" : "Validate draft"}</Button>
        {!canPublishDirectly ? (
          <p className="self-center text-sm text-als-muted">
            Your role can submit content as draft or pending only.
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-als-blue">
        {label}
        {required ? <span className="text-als-red"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
