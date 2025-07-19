import React from "react";
import { Home, User, Folder, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/components/Authentification/PageNavigator.css";

interface PageNavigatorProps {
  isLoggedIn: boolean;
}

const PageNavigator: React.FC<PageNavigatorProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoggedIn) return null;

  const pages = [
    { path: "/home", label: "Home", icon: <Home size={20} /> },
    { path: "/dummy1", label: "Page 1", icon: <Folder size={20} /> },
    { path: "/dummy2", label: "Page 2", icon: <Settings size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <nav className="page-navigator">
      {pages.map((page) => (
        <button
          key={page.path}
          className={`nav-btn ${
            location.pathname === page.path ? "active" : ""
          }`}
          onClick={() => navigate(page.path)}
        >
          {page.icon}
          <span>{page.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default PageNavigator;
