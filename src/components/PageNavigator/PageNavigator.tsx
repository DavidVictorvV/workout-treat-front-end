import React from "react";
import { appPages } from "@/config/pages";
import "./PageNavigator.css";
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
    <nav className="page-navigator">
      {appPages.map((page) => (
        <button
          key={page.id}
          className={`nav-btn ${currentPage === page.id ? "active" : ""}`}
          onClick={() => onNavigate(page.id)}
        >
          {page.icon}
          <span>{page.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default PageNavigator;
