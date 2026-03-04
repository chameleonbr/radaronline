import React from 'react';

interface SidebarSectionTitleProps {
  children: React.ReactNode;
  collapsed: boolean;
}

export const SidebarSectionTitle: React.FC<SidebarSectionTitleProps> = ({ children, collapsed }) => {
  if (collapsed) {
    return <div className="h-px w-full bg-white/10 my-4 mx-auto w-10"></div>;
  }

  return <div className="px-3 mt-6 mb-3 text-[10px] font-bold text-white/50 uppercase tracking-widest">{children}</div>;
};
