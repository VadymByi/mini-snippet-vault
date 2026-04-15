import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    // FULLSCREEN LOADING WRAPPER
    <div className="flex h-screen items-center justify-center bg-slate-50">
      {/* SPINNER ICON */}
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
    </div>
  );
}
