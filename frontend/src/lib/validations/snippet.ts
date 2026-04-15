import * as z from "zod";

// SNIPPET VALIDATION SCHEMA
export const snippetSchema = z.object({
  // TITLE VALIDATION
  title: z.string().min(3, "Заголовок должен быть не менее 3 символов"),

  // CONTENT VALIDATION
  content: z.string().min(1, "Контент не может быть пустым"),

  // TYPE ENUM VALIDATION
  type: z.enum(["note", "command", "link"]),

  // TAGS AS RAW STRING INPUT (CSV FORMAT)
  tags: z.string(),
});

// TYPESCRIPT TYPE FROM ZOD SCHEMA
export type SnippetFormValues = z.infer<typeof snippetSchema>;
