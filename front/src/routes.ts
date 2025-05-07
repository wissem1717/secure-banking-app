import { createBrowserRouter } from "react-router";
import { LoginForm } from "@/app/auth/LoginForm";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { ClientDashboardLayout } from "./app/dashboard/ClientDashboardLayout";
import { ProtectedRoute } from "./app/auth/ProtectedRoute";
import { HomePage } from "./app/home/HomePage";

export const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          index: true,
          Component: HomePage,
        },
        {
          path: "dashboard",
          Component: ProtectedRoute,
          children: [
            { index: true, Component: ClientDashboardLayout },
          ]
        },
        {
          path: "login",
          Component: AuthLayout,
          children: [
            { index: true, Component: LoginForm },
          ],
        },
      ],
    },
]);
