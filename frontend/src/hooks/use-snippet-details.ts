"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SnippetService } from "@/services/snippet.service";

export function useSnippetDetails() {
  // ROUTER + PARAMS
  const { id } = useParams();
  const router = useRouter();

  // QUERY CLIENT (CACHE CONTROL)
  const queryClient = useQueryClient();

  // FETCH SINGLE SNIPPET
  const {
    data: snippet,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["snippet", id],
    queryFn: () => SnippetService.getOne(id as string),
    enabled: !!id,
  });

  // DELETE SNIPPET MUTATION
  const deleteMutation = useMutation({
    mutationFn: () => SnippetService.remove(id as string),

    onSuccess: () => {
      // INVALIDATE LIST CACHE
      queryClient.invalidateQueries({ queryKey: ["snippets"] });

      // NAVIGATE BACK TO HOME AFTER DELETE
      router.push("/");
    },
  });

  return {
    // DATA
    snippet,
    isLoading,
    isError,

    // ACTIONS
    deleteSnippet: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
