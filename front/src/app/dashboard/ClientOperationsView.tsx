// src/app/dashboard/ClientOperationsView.tsx

import { useEffect, useState } from "react"; // hooks pour gérer les effets et l’état
import axios from "axios"; // pour faire les requêtes HTTP vers l'API
import { useParams, useNavigate } from "react-router"; // pour récupérer l’ID du compte depuis l’URL et naviguer
import { useAuth } from "@/hooks/useAuth"; // hook d'authentification (récupère user + token)

interface Operation {
  id: number; // identifiant unique de l’opération
  value: number; // montant de l’opération
  description: string; // texte qui décrit l’opération
}

export default function ClientOperationsView() {
  const { user } = useAuth(); // utilisateur connecté
  const { accountId } = useParams(); // ID du compte récupéré depuis l’URL
  const navigate = useNavigate(); // permet de naviguer vers une autre page
  const [operations, setOperations] = useState<Operation[]>([]); // état local contenant la liste des opérations

  useEffect(() => {
    if (!user || !accountId) return; // vérifie que l'utilisateur et le compte sont disponibles

    axios
      .get(`http://localhost:3000/clients/${user.id}/accounts/${accountId}/operations`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // envoie le token JWT pour sécuriser l’accès
        },
      })
      .then((res) => {
        setOperations(res.data); // stocke les opérations reçues dans le state
      })
      .catch((err) => {
        console.error("Erreur chargement opérations", err); // affiche l'erreur dans la console si la requête échoue
      });
  }, [accountId, user]); // exécute l'effet quand le compte ou l'utilisateur change

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Historique des opérations
      </h2>

      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
          onClick={() => navigate(`/dashboard/accounts/${accountId}/operations/new`)} // bouton pour ajouter une nouvelle opération
        >
          ➕ Nouvelle opération
        </button>
      </div>

      {operations.length === 0 ? ( // si aucune opération, message d'information
        <p className="text-gray-500">Aucune opération pour ce compte.</p>
      ) : (
        <ul className="space-y-3">
          {operations.map((op) => ( // boucle sur les opérations à afficher
            <li
              key={op.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex justify-between">
                <span className="font-bold text-lg text-blue-700">
                  {op.value} € {/* affiche le montant */}
                </span>
                <span className="text-gray-600 italic">{op.description}</span> {/* affiche la description */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
