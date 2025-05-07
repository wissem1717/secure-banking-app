"use client"

import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router"

const activeLinkStyle = "text-blue-700 text-sm font-medium";
const inactiveLinkStyle = "text-gray-700 hover:text-indigo-700 text-sm font-medium";
const linkStyleTrigger = function ({ isActive, isPending }: any) { return ((isPending || isActive) ? activeLinkStyle : inactiveLinkStyle)};

export function ClientDashboard() {
  const { logout } = useAuth();
  
  return (
<div className="fixed top-0 left-0 w-full z-50 bg-white border-b backdrop-blur-lg bg-opacity-80">
  <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 ">
      <div className="relative flex h-16 justify-between">
          <div className="flex justify-start">
              <a className="flex flex-shrink-0 items-center" href="#">
                  <img className="block h-12 w-auto" src="/logo.jpg" />
              </a>
              <p className="flex flex-shrink-0 items-center m-2">
                Espace client
              </p>
          </div>
          <div className="flex-shrink-0 flex px-2 py-3 items-center space-x-8 justify-center">
            <NavLink to="/dashboard/accounts" className={linkStyleTrigger}>
              Comptes
            </NavLink>
          </div>
          <div className="flex-shrink-0 flex px-2 py-3 items-center space-x-8">
            <a className="text-gray-800 bg-indigo-100 hover:bg-indigo-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm "
              onClick={(e) => {e.preventDefault(); logout()}}
            >
              Se déconnecter
            </a>
          </div>
      </div>
  </div>
</div>
  )
}
