import React from "react";
import { appPages } from "@/config/pages";
import { PageIds } from "@/types/PageIds";

interface Props {
  isLoggedIn: boolean;
  currentPage: string;
  onNavigate: (pageId: PageIds) => void;
}

const PageNavigator: React.FC<Props> = ({
  isLoggedIn,
  currentPage,
  onNavigate,
}) => {
  if (!isLoggedIn) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-50">
      <div className="safe-area-pb">
        <div className="flex items-center justify-around px-3 py-4">
          {appPages.map((page) => (
            <button
              key={page.id}
              className={`flex flex-col items-center space-y-2 p-4 rounded-2xl transition-all duration-200 min-w-[80px] ${
                currentPage === page.id
                  ? "bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-400 border border-amber-400/30"
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
              onClick={() => onNavigate(page.id)}
            >
              <div className={`transition-transform duration-200 ${currentPage === page.id ? 'scale-110' : ''}`}>
                <div className="w-7 h-7 flex items-center justify-center">
                  {page.icon}
                </div>
              </div>
              <span className="text-sm font-medium">{page.label}</span>
              {currentPage === page.id && (
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PageNavigator;
