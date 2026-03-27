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
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200",
        variant === "primary" && "bg-accent text-white shadow-soft hover:-translate-y-0.5 hover:shadow-md hover:bg-accent/90",
        variant === "secondary" && "bg-white text-ink ring-1 ring-slate-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300",
        variant === "ghost" && "bg-transparent text-ink hover:bg-slate-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
