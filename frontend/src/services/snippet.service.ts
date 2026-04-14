import { api } from "@/lib/api";
import { ISnippet, PaginatedResponse } from "@/types/snippet";

export const SnippetService = {
  async getAll(params: { q?: string; tag?: string; page?: number } = {}) {
    const { data } = await api.get<PaginatedResponse<ISnippet>>("/snippets", {
      params,
    });
    return data;
  },

  async create(payload: Omit<ISnippet, "_id" | "createdAt" | "updatedAt">) {
    const { data } = await api.post<ISnippet>("/snippets", payload);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/snippets/${id}`);
    return data;
  },
};
