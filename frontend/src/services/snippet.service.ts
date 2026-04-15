import { api } from "@/lib/api";
import { ISnippet, PaginatedResponse } from "@/types/snippet";

// SNIPPET API SERVICE (DATA LAYER)
export const SnippetService = {
  // GET ALL SNIPPETS (WITH FILTERS + PAGINATION)
  async getAll(params: { q?: string; tag?: string; page?: number } = {}) {
    const { data } = await api.get<PaginatedResponse<ISnippet>>("/snippets", {
      params,
    });

    return data;
  },

  // GET SINGLE SNIPPET BY ID
  async getOne(id: string) {
    const { data } = await api.get<ISnippet>(`/snippets/${id}`);
    return data;
  },

  // CREATE NEW SNIPPET
  async create(payload: Omit<ISnippet, "_id" | "createdAt" | "updatedAt">) {
    const { data } = await api.post<ISnippet>("/snippets", payload);
    return data;
  },

  // UPDATE EXISTING SNIPPET
  async update(id: string, payload: Partial<Omit<ISnippet, "_id">>) {
    const { data } = await api.patch<ISnippet>(`/snippets/${id}`, payload);

    return data;
  },

  // DELETE SNIPPET
  async remove(id: string) {
    const { data } = await api.delete(`/snippets/${id}`);
    return data;
  },
};
