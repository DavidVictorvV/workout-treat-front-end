import React from "react";
import AppHeader from "@/components/AppHeader";

interface PageLayoutProps {
  points: number;
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ points, title, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <AppHeader points={points} />
      <div className="pb-24 px-4">
        <div className="py-6">
          <h2 className="text-2xl text-white mb-6">{title}</h2>
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;