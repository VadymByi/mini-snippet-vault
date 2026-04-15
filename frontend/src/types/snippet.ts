export type SnippetType = "note" | "command" | "link";

// MAIN SNIPPET ENTITY TYPE
export interface ISnippet {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
  createdAt: string;
  updatedAt: string;
}

// GENERIC PAGINATED API RESPONSE WRAPPER
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}
