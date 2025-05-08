import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";

interface Compte {
  id: number;
  balance: number;
}

export function ClientAccountsView() {
  const { user } = useAuth();
  const [comptes, setComptes] = useState<Compte[]>([]);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:3000/clients/${user.id}/accounts`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        setComptes(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des comptes :", error);
      });
  }, [user]);

    return (
        <>
            <h1>Comptes</h1>
        </>
    )
}
