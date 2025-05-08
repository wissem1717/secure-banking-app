import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Compte {
  id: number;
  balance: number;
}

export function ClientAccountsView() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const deleteAccount = (accountId: number) => {
    if (!user) return;

    const confirm = window.confirm("Voulez-vous vraiment supprimer ce compte ?");
    if (!confirm) return;

    axios
      .delete(`http://localhost:3000/clients/${user.id}/accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(() => {
        setComptes((prev) => prev.filter((c) => c.id !== accountId));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du compte :", error);
      });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mes Comptes</h1>

      {comptes.length === 0 ? (
        <p className="text-gray-600">Aucun compte trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {comptes.map((compte) => (
            <li
              key={compte.id}
              className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition"
            >
              <p className="font-semibold text-lg">
                Numéro de compte : {compte.id}
              </p>
              <p className="text-gray-700">Solde : {compte.balance} €</p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <button
                  onClick={() => navigate(`/dashboard/accounts/${compte.id}/operations`)}
                  className="text-blue-600 hover:underline"
                >
                  ➤ Voir les opérations
                </button>

                <button
                  onClick={() => navigate(`/dashboard/accounts/${compte.id}/cards`)}
                  className="text-green-600 hover:underline"
                >
                  💳 Voir les cartes
                </button>

                <button
                  onClick={() => navigate(`/dashboard/accounts/${compte.id}/transfer`)}
                  className="text-purple-600 hover:underline"
                >
                  💸 Virement
                </button>

                <button
                  onClick={() => deleteAccount(compte.id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 text-center">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/dashboard/accounts/new")}
        >
          ➕ Créer un compte
        </button>
      </div>
    </div>
  );
}
