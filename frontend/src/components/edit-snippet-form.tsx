"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { snippetSchema, SnippetFormValues } from "@/lib/validations/snippet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SnippetService } from "@/services/snippet.service";
import { ISnippet } from "@/types/snippet";
import { Loader2, Save, X } from "lucide-react";

interface Props {
  snippet: ISnippet;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditSnippetForm({ snippet, onCancel, onSuccess }: Props) {
  const queryClient = useQueryClient();

  // FORM SETUP
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: snippet.title,
      content: snippet.content,
      type: snippet.type,
      tags: snippet.tags.join(", "),
    },
  });

  // UPDATE MUTATION
  const mutation = useMutation({
    mutationFn: (values: SnippetFormValues) => {
      const formatted = {
        ...values,
        tags: values.tags
          ? values.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      return SnippetService.update(snippet._id, formatted);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      queryClient.invalidateQueries({ queryKey: ["snippet", snippet._id] });
      onSuccess();
    },
  });

  const inputStyles =
    "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 transition-all font-medium";

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-6"
    >
      {/* FORM GRID: TITLE + TYPE */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase ml-1">
            Title
          </label>
          <input {...register("title")} className={inputStyles} />

          {errors.title && (
            <p className="text-rose-500 text-xs font-bold">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase ml-1">
            Type
          </label>

          <select {...register("type")} className={inputStyles}>
            <option value="note">📝 Note</option>
            <option value="command">💻 Command</option>
            <option value="link">🔗 Link</option>
          </select>
        </div>
      </div>

      {/* CONTENT FIELD */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase ml-1">
          Content
        </label>

        <textarea
          {...register("content")}
          rows={10}
          className={`${inputStyles} font-mono text-sm`}
        />

        {errors.content && (
          <p className="text-rose-500 text-xs font-bold">
            {errors.content.message}
          </p>
        )}
      </div>

      {/* TAGS FIELD */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase ml-1">
          Tags
        </label>

        <input
          {...register("tags")}
          className={inputStyles}
          placeholder="react, tailwind..."
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
        >
          <X size={18} /> Cancel
        </button>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:bg-slate-300"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          Update Snippet
        </button>
      </div>
    </form>
  );
}
