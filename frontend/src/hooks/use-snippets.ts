import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SnippetService } from "@/services/snippet.service";
import { ISnippet } from "@/types/snippet";

export function useSnippets(searchQuery: string) {
  // QUERY CLIENT (CACHE CONTROL)
  const queryClient = useQueryClient();

  // FETCH SNIPPETS LIST
  const { data, isLoading, isError } = useQuery({
    queryKey: ["snippets", searchQuery],
    queryFn: () => SnippetService.getAll({ q: searchQuery }),
  });

  // CREATE SNIPPET MUTATION
  const createMutation = useMutation({
    mutationFn: (payload: Omit<ISnippet, "_id" | "createdAt" | "updatedAt">) =>
      SnippetService.create(payload),

    onSuccess: () => {
      // REFRESH SNIPPETS LIST AFTER CREATE
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
    },
  });

  // DELETE SNIPPET MUTATION
  const deleteMutation = useMutation({
    mutationFn: (id: string) => SnippetService.remove(id),

    onSuccess: () => {
      // REFRESH SNIPPETS LIST AFTER DELETE
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
    },
  });

  return {
    // DATA
    snippets: data?.data || [],
    isLoading,
    isError,

    // ACTIONS
    createSnippet: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteSnippet: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
