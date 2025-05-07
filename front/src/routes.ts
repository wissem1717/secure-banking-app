import { createBrowserRouter } from "react-router";
import { LoginForm } from "@/app/auth/LoginForm";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { MainLayout } from "./app/layout/MainLayout";
import { ClientDashboard } from "./app/client/ClientDashboard";

export const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "dashboard",
          Component: MainLayout,
          children: [
            { index: true, Component: ClientDashboard },
          ]
        },
        {
          path: "auth",
          Component: AuthLayout,
          children: [
            { index: true, Component: LoginForm },
          ],
        },
      ],
    },
]);
