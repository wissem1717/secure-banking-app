// src/app/dashboard/ClientOperationsView.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

interface Operation {
  id: number;
  value: number;
  description: string;
}

export default function ClientOperationsView() {
  const { user } = useAuth();
  const { accountId } = useParams();
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Liste des opérations</h2>
      {operations.length === 0 ? (
        <p>Aucune opération pour ce compte.</p>
      ) : (
        <ul className="space-y-2">
          {operations.map((op) => (
            <li key={op.id} className="border rounded p-2 shadow-sm">
              <strong>{op.value} €</strong> — {op.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
