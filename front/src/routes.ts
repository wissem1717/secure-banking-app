import BackendCardsView from "@/app/backend/BackendCardsView";
import ClientTransferView from "./app/dashboard/ClientTransferView";
import ClientCardsView from "./app/dashboard/ClientCardsView";
import ClientOperationForm from "./app/dashboard/ClientOperationForm";
import ClientAccountCreate from "./app/dashboard/ClientAccountCreate";
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
import { BackendAccountView } from "./app/backend/BackendAccountView";


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
            {
              path: "accounts/new",
              Component: ClientAccountCreate,
            },
            {
              path: "accounts/:accountId/operations/new",
              Component: ClientOperationForm,
            },
            {
              path: "accounts/:accountId/cards",
              Component: ClientCardsView,
            },
            {
              path: "accounts/:accountId/transfer",
              Component: ClientTransferView,
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
            {
              path: "client/:clientId/account/:accountId",
              Component: BackendAccountView,
            },
            {
              path: "client/:clientId/account/:accountId/cards",
              Component: BackendCardsView,
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
