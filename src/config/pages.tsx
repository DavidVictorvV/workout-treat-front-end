import React from "react";
import { Home, Folder, Settings, User } from "lucide-react";
import HomePage from "@/pages/HomePage";
import DummyPage1 from "@/pages/DummyPage1";
import DummyPage2 from "@/pages/DummyPage2";
import UserDashboard from "@/components/Authentification/UserDashboard";
import { PageIds } from "@/types/PageIds";

export interface AppPage {
  id: PageIds;
  label: string;
  icon: React.ReactNode;
  route: string;
  component: React.FC<any>;
}

export const appPages: AppPage[] = [
  {
    id: PageIds.Home,
    label: "Home",
    icon: <Home size={20} />,
    route: "/home",
    component: HomePage,
  },
  {
    id: PageIds.Dummy1,
    label: "Page 1",
    icon: <Folder size={20} />,
    route: "/dummy1",
    component: DummyPage1,
  },
  {
    id: PageIds.Dummy2,
    label: "Page 2",
    icon: <Settings size={20} />,
    route: "/dummy2",
    component: DummyPage2,
  },
  {
    id: PageIds.Profile,
    label: "Profile",
    icon: <User size={20} />,
    route: "/profile",
    component: UserDashboard,
  },
];
