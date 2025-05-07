"use client"

import { Navbar, NavbarLeft, NavbarRight, NavbarRightButton } from "@/components/ui/navbar";
import { useNavigate } from "react-router"

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Navbar title="Croquettes Solidaires">
      <NavbarLeft>
      </NavbarLeft>
      <NavbarRight>
        <NavbarRightButton onClick={(e) => {e.preventDefault(); navigate("/login")}}>
          Espace Client
        </NavbarRightButton>
      </NavbarRight>
    </Navbar>
  )
}
