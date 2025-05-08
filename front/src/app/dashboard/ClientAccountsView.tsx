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
    <div className="p-6 bg-red-500 w-fit mx-auto mt-10 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-4">Mes Comptes</h1>

      {comptes.length === 0 ? (
        <p>Aucun compte trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {comptes.map((compte) => (
            <li key={compte.id} className="border p-4 rounded shadow bg-white text-black">
              <p><strong>Numéro de compte :</strong> {compte.id}</p>
              <p><strong>Solde :</strong> {compte.balance} €</p>
              <a
                href={`/dashboard/accounts/${compte.id}/operations`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                ➤ Voir les opérations
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
