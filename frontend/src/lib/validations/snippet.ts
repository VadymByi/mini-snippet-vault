import * as z from "zod";

export const snippetSchema = z.object({
  title: z.string().min(3, "Заголовок должен быть не менее 3 символов"),
  content: z.string().min(1, "Контент не может быть пустым"),
  type: z.enum(["note", "command", "link"]),
  tags: z.string(),
});

export type SnippetFormValues = z.infer<typeof snippetSchema>;
