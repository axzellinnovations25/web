import type { PropsWithChildren } from "react";
import { classNames } from "../../utils";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={classNames("rounded-4xl bg-white p-6 shadow-soft ring-1 ring-slate-100", className)}>
      {children}
    </div>
  );
}
