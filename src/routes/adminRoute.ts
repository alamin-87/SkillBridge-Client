import { Route } from "@/types";

export const adminRoute: Route[] = [
  {
    title: "Admin Panel",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
      },
      {
        title: "Users",
        url: "/admin/users",
      },
      {
        title: "Bookings",
        url: "/admin/bookings",
      },
      {
        title: "Categories",
        url: "/admin/categories",
      },
      {
        title: "Profile",
        url: "/admin/profile",
      },
    ],
  },
];
