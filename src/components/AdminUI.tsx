import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const AdminCard = ({ children, className, title, description }: CardProps) => (
  <div className={cn("glass-panel rounded-2xl p-6 transition-all hover:border-white/10", className)}>
    {(title || description) && (
      <div className="mb-6">
        {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
        {description && <p className="text-sm text-neutral-400">{description}</p>}
      </div>
    )}
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  isLoading?: boolean;
}

export const AdminButton = ({
  children,
  className,
  variant = "primary",
  isLoading,
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200",
    secondary: "bg-neutral-800 text-white hover:bg-neutral-700",
    outline: "border border-white/10 text-white hover:bg-white/5",
    ghost: "text-neutral-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const AdminInput = ({ label, error, className, ...props }: InputProps) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-medium text-neutral-400 ml-1">{label}</label>}
    <input
      className={cn(
        "w-full rounded-xl bg-white/5 border border-white/5 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/10 focus:bg-white/10 transition-all",
        error && "border-red-500/50 focus:border-red-500",
        className
      )}
      {...props}
    />
    {error && <p className="text-[10px] text-red-500 ml-1">{error}</p>}
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info";
}

export const AdminBadge = ({ children, variant = "info" }: BadgeProps) => {
  const colors = {
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", colors[variant])}>
      {children}
    </span>
  );
};
