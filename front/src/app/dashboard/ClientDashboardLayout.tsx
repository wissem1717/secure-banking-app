"use client"

import { linkStyleTrigger, Navbar, NavbarLeft, NavbarRight, NavbarRightButton } from "@/components/ui/navbar";
import { useAuth } from "@/hooks/useAuth";
import { NavLink, Outlet } from "react-router"

export function ClientDashboardLayout() {
  const { logout } = useAuth();
  
  return (
    <>
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
      <Outlet/>
    </>
  )
}
