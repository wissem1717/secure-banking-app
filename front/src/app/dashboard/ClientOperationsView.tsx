// src/app/dashboard/ClientOperationsView.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

interface Operation {
  id: number;
  value: number;
  description: string;
}

export default function ClientOperationsView() {
  const { user } = useAuth();
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [operations, setOperations] = useState<Operation[]>([]);

  useEffect(() => {
    if (!user || !accountId) return;

    axios
      .get(`http://localhost:3000/clients/${user.id}/accounts/${accountId}/operations`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setOperations(res.data);
      })
      .catch((err) => {
        console.error("Erreur chargement opérations", err);
      });
  }, [accountId, user]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Historique des opérations
      </h2>

      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
          onClick={() => navigate(`/dashboard/accounts/${accountId}/operations/new`)}
        >
          ➕ Nouvelle opération
        </button>
      </div>

      {operations.length === 0 ? (
        <p className="text-gray-500">Aucune opération pour ce compte.</p>
      ) : (
        <ul className="space-y-3">
          {operations.map((op) => (
            <li
              key={op.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex justify-between">
                <span className="font-bold text-lg text-blue-700">
                  {op.value} €
                </span>
                <span className="text-gray-600 italic">{op.description}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
