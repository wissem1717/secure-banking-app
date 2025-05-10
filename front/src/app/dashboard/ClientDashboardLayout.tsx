"use client" // directive pour indiquer que ce composant s’exécute côté client (React)

import { linkStyleTrigger, Navbar, NavbarLeft, NavbarRight, NavbarRightButton } from "@/components/ui/navbar"; // composants de la barre de navigation
import { useAuth } from "@/hooks/useAuth"; // hook d’authentification (permet ici d’accéder à logout)
import { NavLink, Outlet } from "react-router"; // navigation entre pages + affichage des sous-composants
import { ProtectedRoute } from "../auth/ProtectedRoute"; // protège l’accès au layout si l’utilisateur n’est pas connecté

export function ClientDashboardLayout() {
  const { logout } = useAuth(); // fonction pour se déconnecter

  return (
    <ProtectedRoute role="user"> {/* empêche l’accès si l’utilisateur n’est pas du rôle "user" */}
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Navbar title="Espace Client"> {/* barre de navigation avec le titre */}
          <NavbarLeft>
            <NavLink to="/dashboard" className={linkStyleTrigger}> {/* lien vers la page des comptes */}
              Mes Comptes
            </NavLink>
          </NavbarLeft>
          <NavbarRight>
            <NavbarRightButton
              onClick={(e) => {
                e.preventDefault(); // empêche le rechargement de la page
                logout(); // déclenche la déconnexion
              }}
            >
              Se déconnecter
            </NavbarRightButton>
          </NavbarRight>
        </Navbar>

        <main className="flex-1 flex justify-center items-center px-4"> {/* contenu principal centré */}
          <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
            <Outlet /> {/* affiche dynamiquement la page enfant (ex: comptes, opérations...) */}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
