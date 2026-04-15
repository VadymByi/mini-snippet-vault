"use client";

import { SnippetService } from "@/services/snippet.service";
import {
  Terminal,
  FileText,
  Link as LinkIcon,
  Loader2,
  Plus,
  Trash2,
  Search,
  Hash,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { snippetSchema, SnippetFormValues } from "@/lib/validations/snippet";
import { ISnippet } from "@/types/snippet";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function HomePage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["snippets", debouncedSearch],
    queryFn: () => SnippetService.getAll({ q: debouncedSearch }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "note",
      tags: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: Omit<ISnippet, "_id" | "createdAt" | "updatedAt">) =>
      SnippetService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SnippetService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
    },
  });

  const onSubmit = (values: SnippetFormValues) => {
    const formattedData = {
      ...values,
      tags: values.tags
        ? values.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== "")
        : [],
    };
    mutation.mutate(formattedData);
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "command":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "link":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 mb-10">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Snippet
            <span className="text-indigo-600 underline decoration-wavy decoration-2 underline-offset-4">
              Vault
            </span>
          </h1>
          <p className="mt-2 text-slate-600 font-medium">
            Your personal second brain for code and links.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl">
        {/* Form Section */}
        <section className="mb-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm ring-1 ring-slate-900/5">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Plus size={18} />
            </div>
            Create Snippet
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Title
                </label>
                <input
                  {...register("title")}
                  placeholder="e.g. Docker Cleanup Command"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400"
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-900 cursor-pointer"
                >
                  <option value="note">📝 Note</option>
                  <option value="command">💻 Command</option>
                  <option value="link">🔗 Link</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Content
              </label>
              <textarea
                {...register("content")}
                placeholder="Paste your snippet here..."
                rows={4}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-mono text-sm text-slate-900"
              />
              {errors.content && (
                <p className="text-rose-600 text-xs font-medium mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Tags
              </label>
              <input
                {...register("tags")}
                placeholder="react, tailwind, backend..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 disabled:bg-slate-300 transition-all shadow-md shadow-indigo-200"
            >
              {mutation.isPending ? "Syncing..." : "Save to Vault"}
            </button>
          </form>
        </section>

        {/* Search */}
        <div className="mb-10 group">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title, content or tags..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-medium transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        {isError ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 font-semibold">
            Failed to sync with vault. Please check your backend connection.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {data?.data.map((snippet) => (
              <div
                key={snippet._id}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getTypeStyles(snippet.type)}`}
                  >
                    <span className="flex items-center gap-1">
                      {snippet.type === "command" && <Terminal size={12} />}
                      {snippet.type === "note" && <FileText size={12} />}
                      {snippet.type === "link" && <LinkIcon size={12} />}
                      {snippet.type}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Remove this snippet?"))
                        deleteMutation.mutate(snippet._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                  {snippet.title}
                </h2>

                <div className="relative mb-4 grow">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed shadow-inner">
                    <code>{snippet.content}</code>
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {snippet.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="flex items-center gap-0.5 text-slate-600 text-xs font-bold px-2 py-1 bg-slate-100 rounded-md border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <Hash size={10} className="text-slate-400" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && data?.data.length === 0 && (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="text-slate-400 font-medium text-lg">
              Your vault is empty.
            </div>
            <p className="text-slate-400 text-sm">
              Create your first snippet using the form above.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
