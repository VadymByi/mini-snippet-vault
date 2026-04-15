export function Header() {
  return (
    // HEADER CONTAINER
    <div className="bg-white border-b border-slate-200 mb-10">
      {/* HEADER CONTENT WRAPPER */}
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* TITLE */}
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Snippet{" "}
          <span className="text-indigo-600 underline decoration-wavy decoration-2 underline-offset-4">
            Vault
          </span>
        </h1>

        {/* SUBTITLE */}
        <p className="mt-2 text-slate-600 font-medium">
          Your personal second brain for code and links.
        </p>
      </div>
    </div>
  );
}
