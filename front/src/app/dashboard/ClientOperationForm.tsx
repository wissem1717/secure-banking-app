// src/app/dashboard/ClientOperationForm.tsx

import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useNavigate } from "react-router";

export default function ClientOperationForm() {
  const { user } = useAuth();
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !accountId) return;

    try {
      await axios.post(
        `http://localhost:3000/clients/${user.id}/accounts/${accountId}/operations`,
        { value, description },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMessage("Opération ajoutée avec succès !");
      setValue(0);
      setDescription("");
      setTimeout(() => navigate(`/dashboard/accounts/${accountId}/operations`), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'ajout de l'opération.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Nouvelle opération</h2>
      {message && <p className="mb-4 text-sm text-center text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Montant (€)</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded"
        >
          Ajouter l’opération
        </button>
      </form>
    </div>
  );
}
