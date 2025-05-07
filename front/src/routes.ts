import { createBrowserRouter } from "react-router";
import { LoginForm } from "@/app/auth/LoginForm";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { ClientDashboard } from "./app/dashboard/ClientDashboard";
import { ProtectedRoute } from "./app/auth/ProtectedRoute";

export const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "dashboard",
          Component: ProtectedRoute,
          children: [
            { index: true, Component: ClientDashboard },
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
