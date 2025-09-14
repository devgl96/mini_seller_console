import { cn } from "../../utils";
import type { BadgeProps } from "./types";

export function StatusBadge(props: BadgeProps) {
  const { status, className } = props;

  let color = "";

  switch (status) {
    case "New":
      color = "bg-yellow-100 text-yellow-800";
      break;
    case "Contacted":
      color = "bg-blue-100 text-blue-800";
      break;
    case "Qualified":
      color = "bg-green-100 text-green-800";
      break;
    case "Unqualified":
      color = "bg-red-100 text-red-800";
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        color,
        className || ""
      )}
    >
      {status}
    </span>
  );
}
