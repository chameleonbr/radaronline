import React from "react";

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

const base = "inline-flex items-center justify-center font-bold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";

const variants: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:text-slate-400",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 disabled:text-slate-400"
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm"
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = "", children, ...rest }) => (
  <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
    {children}
  </button>
);

