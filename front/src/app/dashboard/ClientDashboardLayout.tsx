"use client"

import { linkStyleTrigger, Navbar, NavbarLeft, NavbarRight, NavbarRightButton } from "@/components/ui/navbar";
import { useAuth } from "@/hooks/useAuth";
import { NavLink, Outlet } from "react-router"
import { ProtectedRoute } from "../auth/ProtectedRoute";

export function ClientDashboardLayout() {
  const { logout } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full">
        <Navbar title="Espace Client">
          <NavbarLeft>
            <NavLink to="/dashboard" className={linkStyleTrigger}>
              Mes Comptes
            </NavLink>
          </NavbarLeft>
          <NavbarRight>
            <NavbarRightButton onClick={(e) => {e.preventDefault(); logout()}}>
              Se déconnecter
            </NavbarRightButton>
          </NavbarRight>
        </Navbar>
        <div className="mx-auto max-w-6xl grow flex-1 bg-red-500">
          <Outlet/>
        </div>
      </div>
    </ProtectedRoute>
  )
}
