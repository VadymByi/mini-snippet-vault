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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Помилка при завантаженні, можливо не запущений бек
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6 max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold">My Snippet Vault</h1>

      <section className="mb-12 p-6 border rounded-xl bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} /> Add New Snippet
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <input
                {...register("title")}
                placeholder="Title (e.g. Git Commit)"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...register("type")}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="note">Note</option>
                <option value="command">Command</option>
                <option value="link">Link</option>
              </select>
            </div>
          </div>

          <div>
            <textarea
              {...register("content")}
              placeholder="Your code or note here..."
              rows={3}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("tags")}
              placeholder="Tags (comma separated: git, tutorial, work)"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {mutation.isPending ? "Saving..." : "Save Snippet"}
          </button>
        </form>
      </section>
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search snippets by title or content..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((snippet) => (
          <div
            key={snippet._id}
            className="rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium uppercase text-gray-500 flex items-center gap-2">
                {snippet.type === "command" && <Terminal size={16} />}
                {snippet.type === "note" && <FileText size={16} />}
                {snippet.type === "link" && <LinkIcon size={16} />}
                {snippet.type}
              </span>
              <button
                onClick={() => {
                  if (confirm("Удалить этот сниппет?"))
                    deleteMutation.mutate(snippet._id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={deleteMutation.isPending}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-2">{snippet.title}</h2>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto border border-gray-100 mb-3">
              <code>{snippet.content}</code>
            </pre>
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full border border-blue-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data?.data.length === 0 && (
        <p className="text-center text-gray-500 mt-10">Сниппетов пока нет.</p>
      )}
    </main>
  );
}
