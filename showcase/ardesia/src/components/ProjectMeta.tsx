import type { Project } from "@/data/site";

/** Publication-style colophon for a project. */
export function ProjectMeta({ project, tone = "ink", className = "" }: { project: Project; tone?: "ink" | "night"; className?: string }) {
  const label = tone === "ink" ? "text-muted" : "text-night-muted";
  const rows = [
    ["Category", project.category],
    ["Location", project.location],
    ["Year", project.year],
    ["Services", project.services.join(", ")],
  ];
  return (
    <dl className={`grid grid-cols-2 gap-x-[var(--gutter)] gap-y-6 t-small ${className}`}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className={label}>{k}</dt>
          <dd className="mt-1">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
