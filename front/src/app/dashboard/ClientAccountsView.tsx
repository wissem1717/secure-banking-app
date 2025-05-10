import { useAuth } from "@/hooks/useAuth"; // permet de récupérer l'utilisateur connecté (et son token)
import axios from "axios"; // pour faire des requêtes HTTP à l'API
import { useEffect, useState } from "react"; // hooks React pour gérer les effets et les données locales
import { useNavigate } from "react-router"; // pour rediriger vers d'autres pages

interface Compte {
  id: number; // identifiant du compte
  balance: number; // solde du compte
}

export function ClientAccountsView() {
  const { user } = useAuth(); // récupération de l'utilisateur connecté
  const navigate = useNavigate(); // permet de rediriger vers une autre route
  const [comptes, setComptes] = useState<Compte[]>([]); // état local qui contient la liste des comptes

  useEffect(() => {
    if (!user) return; // si l'utilisateur n'est pas connecté, on ne fait rien

    axios
      .get(`http://localhost:3000/clients/${user.id}/accounts`, {
        headers: { Authorization: `Bearer ${user.token}` }, // envoie le token dans les headers
      })
      .then((response) => {
        setComptes(response.data); // met à jour la liste des comptes avec les données reçues
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des comptes :", error); // affiche une erreur si la requête échoue
      });
  }, [user]); // déclenche l'effet quand le user change

  const deleteAccount = (accountId: number) => {
    if (!user) return; // vérifie si l'utilisateur est bien connecté

    const confirm = window.confirm("Voulez-vous vraiment supprimer ce compte ?"); // demande confirmation
    if (!confirm) return; // si l'utilisateur annule, on ne fait rien

    axios
      .delete(`http://localhost:3000/clients/${user.id}/accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${user.token}` }, // envoie le token dans les headers
      })
      .then(() => {
        setComptes((prev) => prev.filter((c) => c.id !== accountId)); // supprime le compte de la liste localement
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du compte :", error); // affiche une erreur si la requête échoue
      });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mes Comptes</h1>

      {comptes.length === 0 ? ( // si aucun compte trouvé
        <p className="text-gray-600">Aucun compte trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {comptes.map((compte) => ( // pour chaque compte, on affiche les infos et les boutons d'action
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
                  onClick={() => navigate(`/dashboard/accounts/${compte.id}/operations`)} // redirige vers les opérations du compte
                  className="text-blue-600 hover:underline"
                >
                  ➤ Voir les opérations
                </button>

                <button
                  onClick={() => navigate(`/dashboard/accounts/${compte.id}/cards`)} // redirige vers les cartes du compte
                  className="text-green-600 hover:underline"
                >
                  💳 Voir les cartes
                </button>

                <button
                  onClick={() => navigate(`/dashboard/accounts/${compte.id}/transfer`)} // redirige vers la page de virement
                  className="text-purple-600 hover:underline"
                >
                  💸 Virement
                </button>

                <button
                  onClick={() => deleteAccount(compte.id)} // supprime le compte après confirmation
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
          onClick={() => navigate("/dashboard/accounts/new")} // redirige vers la page de création d’un compte
        >
          ➕ Créer un compte
        </button>
      </div>
    </div>
  );
}
