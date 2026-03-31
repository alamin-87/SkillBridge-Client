import { Route } from "@/types";

export const studentRoute: Route[] = [
  {
    title: "Student Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "LayoutDashboard",
      },
      {
        title: "My Bookings",
        url: "/dashboard/bookings",
        icon: "CalendarCheck",
      },
      {
        title: "Assignments",
        url: "/dashboard/assignments",
        icon: "ClipboardList",
      },
      {
        title: "Payments",
        url: "/dashboard/payments",
        icon: "CreditCard",
      },
      {
        title: "My Reviews",
        url: "/dashboard/reviews",
        icon: "Star",
      },
      {
        title: "Become a Tutor",
        url: "/dashboard/become-tutor",
        icon: "GraduationCap",
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: "User",
      },
    ],
  },
];
