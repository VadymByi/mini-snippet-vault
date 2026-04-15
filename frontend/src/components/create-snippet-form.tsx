"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { snippetSchema, SnippetFormValues } from "@/lib/validations/snippet";
import { Plus } from "lucide-react";
import { ISnippet } from "@/types/snippet";

interface CreateSnippetFormProps {
  onSubmit: (
    values: Omit<ISnippet, "_id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  isPending: boolean;
}

export function CreateSnippetForm({
  onSubmit,
  isPending,
}: CreateSnippetFormProps) {
  // FORM SETUP
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetSchema),
    defaultValues: { title: "", content: "", type: "note", tags: "" },
  });

  // SUBMIT HANDLER
  const handleFormSubmit = async (values: SnippetFormValues) => {
    const formattedData = {
      ...values,
      tags: values.tags
        ? values.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== "")
        : [],
    };

    await onSubmit(formattedData);
    reset();
  };

  return (
    <section className="mb-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm ring-1 ring-slate-900/5">
      {/* HEADER */}
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <Plus size={18} />
        </div>
        Create Snippet
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* TITLE + TYPE */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Title
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Docker Cleanup"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-900"
            />
            {errors.title && (
              <p className="text-rose-600 text-xs font-medium mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            >
              <option value="note">📝 Note</option>
              <option value="command">💻 Command</option>
              <option value="link">🔗 Link</option>
            </select>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Content
          </label>
          <textarea
            {...register("content")}
            placeholder="Paste code here..."
            rows={4}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm text-slate-900"
          />
          {errors.content && (
            <p className="text-rose-600 text-xs font-medium mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* TAGS */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700 ml-1">Tags</label>
          <input
            {...register("tags")}
            placeholder="react, nextjs..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-md shadow-indigo-200"
        >
          {isPending ? "Syncing..." : "Save to Vault"}
        </button>
      </form>
    </section>
  );
}
