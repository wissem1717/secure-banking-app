import { createBrowserRouter } from "react-router";
import { LoginForm } from "@/app/auth/LoginForm";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { ClientDashboard } from "./app/dashboard/ClientDashboard";
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
