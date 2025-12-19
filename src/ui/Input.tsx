import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export const Input: React.FC<InputProps> = ({ label, className = "", ...rest }) => (
  <label className="block w-full">
    {label && <span className="text-xs font-bold text-slate-500 uppercase block mb-1">{label}</span>}
    <input className={`w-full border border-slate-200 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`} {...rest} />
  </label>
);

