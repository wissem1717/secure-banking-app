"use client" // Directive Next.js pour indiquer que ce composant est côté client

import { linkStyleTrigger, Navbar, NavbarLeft, NavbarRight, NavbarRightButton } from "@/components/ui/navbar"; // Composants de navigation
import { useAuth } from "@/hooks/useAuth"; // Hook pour récupérer les infos d’authentification
import { NavLink, Outlet } from "react-router" // Navigation et affichage des sous-routes
import { ProtectedRoute } from "../auth/ProtectedRoute"; // Composant qui protège les routes selon le rôle

export function BackendLayout() {
  const { logout } = useAuth(); // Fonction pour déconnecter l’utilisateur
  
  return (
    <ProtectedRoute role="employee"> {/* Accès réservé aux employés */}
      <div className="flex flex-col h-full">
        <Navbar title="Espace Interne"> {/* Barre de navigation du haut */}
          <NavbarLeft>
            <NavLink to="/backend/clients" className={linkStyleTrigger}>
              Liste des clients
            </NavLink>
          </NavbarLeft>
          <NavbarRight>
            <NavLink to="/" className={linkStyleTrigger}>
              Accueil
            </NavLink>
            <NavbarRightButton onClick={(e) => {e.preventDefault(); logout()}}> {/* Bouton de déconnexion */}
              Se déconnecter
            </NavbarRightButton>
          </NavbarRight>
        </Navbar>
        <div className="mx-auto w-6xl grow flex-1"> {/* Zone centrale pour les vues internes */}
          <Outlet/> {/* Affiche la page fille courante */}
        </div>
      </div>
    </ProtectedRoute>
  )
}
