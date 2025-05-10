import BackendCardsView from "@/app/backend/BackendCardsView"; // page des cartes côté employé
import ClientTransferView from "./app/dashboard/ClientTransferView"; // page de virement client
import ClientCardsView from "./app/dashboard/ClientCardsView"; // page des cartes côté client
import ClientOperationForm from "./app/dashboard/ClientOperationForm"; // formulaire pour ajouter une opération
import ClientAccountCreate from "./app/dashboard/ClientAccountCreate"; // formulaire pour créer un compte
import ClientOperationsView from "./app/dashboard/ClientOperationsView"; // affichage des opérations d’un compte
import { createBrowserRouter } from "react-router"; // pour déclarer toutes les routes de l'application
import { LoginForm } from "@/app/auth/LoginForm"; // formulaire d’authentification
import { AuthLayout } from "@/app/auth/AuthLayout"; // mise en page pour l'auth (centrée, simple)
import { ClientDashboardLayout } from "./app/dashboard/ClientDashboardLayout"; // layout principal pour l’espace client
import { HomePage } from "./app/home/HomePage"; // page d’accueil
import { ClientAccountsView } from "./app/dashboard/ClientAccountsView"; // page qui affiche tous les comptes du client
import { BackendLayout } from "./app/backend/BackendLayout"; // layout principal pour l’espace employé
import { BackendClientsView } from "./app/backend/BackendClientsView"; // page qui liste tous les clients (employé)
import { BackendClientCreationView } from "./app/backend/BackendClientCreationView"; // formulaire pour créer un nouveau client
import { BackendClientView } from "./app/backend/BackendClientView"; // affichage d’un client spécifique
import { BackendAccountView } from "./app/backend/BackendAccountView"; // affichage des infos d’un compte client

export const router = createBrowserRouter([
    {
      path: "/", // racine du site
      children: [
        {
          index: true, // route par défaut ("/")
          Component: HomePage, // affiche la page d’accueil
        },
        {
          path: "dashboard", // partie client (espace utilisateur)
          Component: ClientDashboardLayout, // mise en page client avec Navbar
          children: [
            {
              index: true, // /dashboard
              Component: ClientAccountsView, // liste des comptes bancaires du client
            },
            {
              path: "accounts/:accountId/operations", // opérations d’un compte donné
              Component: ClientOperationsView,
            },
            {
              path: "accounts/new", // formulaire pour créer un compte
              Component: ClientAccountCreate,
            },
            {
              path: "accounts/:accountId/operations/new", // formulaire pour ajouter une opération
              Component: ClientOperationForm,
            },
            {
              path: "accounts/:accountId/cards", // liste des cartes liées à un compte
              Component: ClientCardsView,
            },
            {
              path: "accounts/:accountId/transfer", // formulaire de virement
              Component: ClientTransferView,
            },           
          ]
        },
        {
          path: "backend", // partie employé
          Component: BackendLayout, // mise en page pour l’employé
          children: [
            {
              path: "clients", // liste de tous les clients
              Component: BackendClientsView,
            },
            {
              path: "client/new", // formulaire de création de client
              Component: BackendClientCreationView,
            },
            {
              path: "client/:id", // affichage d’un client par son ID
              Component: BackendClientView,
            },
            {
              path: "client/:clientId/account/:accountId", // affichage d’un compte d’un client
              Component: BackendAccountView,
            },
            {
              path: "client/:clientId/account/:accountId/cards", // liste des cartes du compte (côté employé)
              Component: BackendCardsView,
            },           
          ]
        },
        {
          path: "login", // page de connexion
          Component: AuthLayout, // layout centré pour l’authentification
          children: [
            { index: true, Component: LoginForm }, // formulaire de login par défaut
          ],
        },
      ],
    },
]);
