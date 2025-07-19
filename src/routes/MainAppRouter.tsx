import React from "react";
import { appPages } from "@/config/pages";
import type { User } from "@/types/User";
import { PageIds } from "@/types/PageIds";

interface Props {
  currentPage: string;
  currentUser: User;
  onLogout: () => void;
}

const MainAppRouter: React.FC<Props> = ({
  currentPage,
  currentUser,
  onLogout,
}) => {
  const page = appPages.find((p) => p.id === currentPage);

  if (!page) return null;

  if (page.id === PageIds.Profile) {
    const ProfileComponent = page.component;
    return (
      <ProfileComponent
        user={currentUser}
        onLogout={onLogout}
        onUserUpdate={() => {}}
      />
    );
  }

  const Component = page.component;
  return <Component />;
};

export default MainAppRouter;
