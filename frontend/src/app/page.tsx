"use client";

import { useQuery } from "@tanstack/react-query";
import { SnippetService } from "@/services/snippet.service";
import { Terminal, FileText, Link as LinkIcon, Loader2 } from "lucide-react";

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["snippets"],
    queryFn: () => SnippetService.getAll(),
  });

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
        Помилка при завантаженні - можливо не запущен бек
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">My Snippet Vault</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((snippet) => (
          <div
            key={snippet._id}
            className="rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium uppercase text-gray-500 flex items-center gap-2">
                {snippet.type === "command" && <Terminal size={16} />}
                {snippet.type === "note" && <FileText size={16} />}
                {snippet.type === "link" && <LinkIcon size={16} />}
                {snippet.type}
              </span>
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
        <p className="text-center text-gray-500 mt-10">здесь сниппеты</p>
      )}
    </main>
  );
}
