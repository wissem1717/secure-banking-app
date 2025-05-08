"use client"

import { linkStyleTrigger, Navbar, NavbarLeft, NavbarRight, NavbarRightButton } from "@/components/ui/navbar";
import { useAuth } from "@/hooks/useAuth";
import { NavLink, Outlet } from "react-router";
import { ProtectedRoute } from "../auth/ProtectedRoute";

export function ClientDashboardLayout() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute role="user">
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Navbar title="Espace Client">
          <NavbarLeft>
            <NavLink to="/dashboard" className={linkStyleTrigger}>
              Mes Comptes
            </NavLink>
          </NavbarLeft>
          <NavbarRight>
            <NavbarRightButton
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Se déconnecter
            </NavbarRightButton>
          </NavbarRight>
        </Navbar>

        <main className="flex-1 flex justify-center items-center px-4">
          <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
