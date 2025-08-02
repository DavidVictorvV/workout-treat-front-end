import React from "react";
import { Dumbbell, BarChart3, ShoppingBag, User } from "lucide-react";
import HomePage from "@/pages/HomePage";
import ProgressPage from "@/pages/ProgressPage";
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
    label: "Workouts",
    icon: <Dumbbell size={20} />,
    route: "/workouts",
    component: HomePage,
  },
  {
    id: PageIds.Dummy2,
    label: "Store",
    icon: <ShoppingBag size={20} />,
    route: "/store",
    component: DummyPage2,
  },
  {
    id: PageIds.Dummy1,
    label: "Stats",
    icon: <BarChart3 size={20} />,
    route: "/stats",
    component: ProgressPage,
  },
  {
    id: PageIds.Profile,
    label: "Profile",
    icon: <User size={20} />,
    route: "/profile",
    component: UserDashboard,
  },
];
