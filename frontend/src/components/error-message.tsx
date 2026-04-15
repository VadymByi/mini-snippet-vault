import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    // ERROR CONTAINER
    <div className="p-8 flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 font-semibold shadow-sm">
      {/* ERROR ICON */}
      <AlertCircle size={24} className="shrink-0" />

      {/* ERROR TEXT */}
      <p>{message} Please check your backend connection.</p>
    </div>
  );
}
