import ClientOperationsView from "./app/dashboard/ClientOperationsView";
import { createBrowserRouter } from "react-router";
import { LoginForm } from "@/app/auth/LoginForm";
import { AuthLayout } from "@/app/auth/AuthLayout";
import { ClientDashboardLayout } from "./app/dashboard/ClientDashboardLayout";
import { HomePage } from "./app/home/HomePage";
import { ClientAccountsView } from "./app/dashboard/ClientAccountsView";
import { BackendLayout } from "./app/backend/BackendLayout";
import { BackendClientsView } from "./app/backend/BackendClientsView";
import { BackendClientCreationView } from "./app/backend/BackendClientCreationView";
import { BackendClientView } from "./app/backend/BackendClientView";

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
          Component: ClientDashboardLayout,
          children: [
            {
              index: true,
              Component: ClientAccountsView,
            },
            {
              path: "accounts/:accountId/operations",
              Component: ClientOperationsView,
            },
          ]
        },
        {
          path: "backend",
          Component: BackendLayout,
          children: [
            {
              path: "clients",
              Component: BackendClientsView,
            },
            {
              path: "client/new",
              Component: BackendClientCreationView,
            },
            {
              path: "client/:id",
              Component: BackendClientView,
            },
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
