"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
      <pre className="text-sm text-muted-foreground bg-muted rounded-lg p-4 overflow-auto whitespace-pre-wrap">
        {error.message}
      </pre>
      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground">Digest: {error.digest}</p>
      )}
    </div>
  );
}
