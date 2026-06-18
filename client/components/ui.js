import clsx from "clsx";

export function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:opacity-50",
        variant === "primary" && "bg-brand text-white hover:bg-blue-700",
        variant === "secondary" && "border border-border bg-white text-ink hover:bg-surface",
        variant === "danger" && "bg-danger text-white hover:bg-red-700",
        className
      )}
      {...props}
    />
  );
}

export function Input(props) {
  return <input className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-brand" {...props} />;
}

export function Textarea(props) {
  return <textarea className="min-h-28 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand" {...props} />;
}

export function Field({ label, children, error }) {
  return (
    <label className="grid gap-1 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}

export function Panel({ className, ...props }) {
  return <section className={clsx("rounded-lg border border-border bg-white p-5", className)} {...props} />;
}
