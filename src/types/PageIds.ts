export type PageIds = "home" | "dummy1" | "dummy2" | "profile";

export const PageIds = {
  Home: "home" as const,
  Dummy1: "dummy1" as const,
  Dummy2: "dummy2" as const,
  Profile: "profile" as const,
};
