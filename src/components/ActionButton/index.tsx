import type { ActionButtonProps } from "./types";

export function ActionButton(props: ActionButtonProps) {
  const { children, ...rest } = props;

  return (
    <button
      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-[var(--text-on-primary)] bg-[var(--primary-color)] border border-transparent rounded-md shadow-sm hover:bg-[var(--primary-color-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition my-4 hover:cursor-pointer"
      type="submit"
      {...rest}
    >
      {children}
    </button>
  );
}
