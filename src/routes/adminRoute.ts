import { Route } from "@/types";

export const adminRoute: Route[] = [
  {
    title: "Admin Panel",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: "LayoutDashboard",
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: "Users",
      },
      {
        title: "Bookings",
        url: "/admin/bookings",
        icon: "CalendarCheck",
      },
      {
        title: "Payments",
        url: "/admin/payments",
        icon: "CreditCard",
      },
      {
        title: "Categories",
        url: "/admin/categories",
        icon: "Layers",
      },
      {
        title: "Tutor Requests",
        url: "/admin/tutor-requests",
        icon: "UserPlus",
      },
      {
        title: "Reviews",
        url: "/admin/reviews",
        icon: "Star",
      },
      {
        title: "Notifications",
        url: "/admin/notifications",
        icon: "Bell",
      },
      {
        title: "Assignments",
        url: "/admin/assignments",
        icon: "ClipboardList",
      },
      {
        title: "Profile",
        url: "/admin/profile",
        icon: "UserCog",
      },
    ],
  },
];
