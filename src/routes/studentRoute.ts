import { Route } from "@/types";

export const studentRoute: Route[] = [
  {
    title: "Student Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
      },
      {
        title: "My Bookings",
        url: "/dashboard/bookings",
      },
      {
        title: "Assignments",
        url: "/dashboard/assignments",
      },
      {
        title: "Payments",
        url: "/dashboard/payments",
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
      },
    ],
  },
];
