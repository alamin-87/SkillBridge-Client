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
        title: "My Reviews",
        url: "/dashboard/reviews",
      },
      {
        title: "Become a Tutor",
        url: "/dashboard/become-tutor",
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
      },
    ],
  },
];
