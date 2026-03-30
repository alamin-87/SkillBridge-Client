import { Route } from "@/types";

export const tutorRoute: Route[] = [
  {
    title: "Tutor Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/tutor/dashboard",
        icon: "LayoutDashboard",
      },
      {
        title: "Sessions",
        url: "/tutor/dashboard/sessions",
        icon: "CalendarCheck",
      },
      {
        title: "Assignments",
        url: "/tutor/dashboard/assignments",
        icon: "ClipboardList",
      },
      {
        title: "Earnings",
        url: "/tutor/dashboard/earnings",
        icon: "Wallet",
      },
      {
        title: "Availability",
        url: "/tutor/availability",
        icon: "Clock",
      },
      {
        title: "Profile",
        url: "/tutor/profile",
        icon: "UserCog",
      },
    ],
  },
];
