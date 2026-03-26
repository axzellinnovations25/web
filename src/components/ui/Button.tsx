import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { classNames } from "../../utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
        variant === "primary" && "bg-accent text-white shadow-soft hover:opacity-95",
        variant === "secondary" && "bg-white/90 text-ink ring-1 ring-slate-200 hover:bg-white",
        variant === "ghost" && "bg-transparent text-ink hover:bg-white/60",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
