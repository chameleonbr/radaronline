import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export const Select: React.FC<SelectProps> = ({ label, className = "", children, ...rest }) => (
  <label className="block w-full">
    {label && <span className="text-xs font-bold text-slate-500 uppercase block mb-1">{label}</span>}
    <select className={`w-full border border-slate-200 rounded p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`} {...rest}>
      {children}
    </select>
  </label>
);

