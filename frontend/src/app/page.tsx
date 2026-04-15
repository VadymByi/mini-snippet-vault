"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useSnippets } from "@/hooks/use-snippets";
import { CreateSnippetForm } from "@/components/create-snippet-form";
import { SearchInput } from "@/components/search-input";
import { Header } from "@/components/header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ErrorMessage } from "@/components/error-message";
import { SnippetList } from "@/components/snippet-list";

export default function HomePage() {
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  // DATA FETCHING & MUTATIONS
  const {
    snippets,
    isLoading,
    isError,
    createSnippet,
    isCreating,
    deleteSnippet,
    isDeleting,
  } = useSnippets(debouncedSearch);

  // LOADING STATE
  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      {/* HEADER */}
      <Header />

      <div className="container mx-auto px-6 max-w-5xl">
        {/* CREATE FORM */}
        <CreateSnippetForm
          onSubmit={async (data) => {
            await createSnippet(data);
          }}
          isPending={isCreating}
        />

        {/* SEARCH INPUT */}
        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        {/* LIST / ERROR STATE */}
        {isError ? (
          <ErrorMessage message="Failed to sync with vault." />
        ) : (
          <SnippetList
            snippets={snippets}
            onDelete={deleteSnippet}
            isDeleting={isDeleting}
            onTagClick={setSearchQuery}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </main>
  );
}
