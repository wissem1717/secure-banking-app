// src/app/dashboard/ClientOperationForm.tsx

import { useState } from "react"; // pour gérer les champs du formulaire et les messages
import axios from "axios"; // pour envoyer la requête POST à l'API
import { useAuth } from "@/hooks/useAuth"; // pour récupérer l'utilisateur connecté et son token
import { useParams, useNavigate } from "react-router"; // pour récupérer l'ID du compte depuis l'URL et naviguer

export default function ClientOperationForm() {
  const { user } = useAuth(); // utilisateur actuellement connecté
  const { accountId } = useParams(); // identifiant du compte depuis l'URL
  const navigate = useNavigate(); // redirection après l'ajout de l'opération

  const [value, setValue] = useState<number>(0); // champ : montant de l'opération
  const [description, setDescription] = useState(""); // champ : description de l'opération
  const [message, setMessage] = useState(""); // message de succès ou d'erreur à afficher

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // empêche le rechargement de la page

    if (!user || !accountId) return; // vérifie que l'utilisateur et le compte sont valides

    try {
      await axios.post( // envoie une requête POST à l'API pour créer une opération
        `http://localhost:3000/clients/${user.id}/accounts/${accountId}/operations`,
        { value, description }, // données à envoyer : montant et description
        {
          headers: { Authorization: `Bearer ${user.token}` }, // envoie le token dans les headers pour sécuriser l'accès
        }
      );
      setMessage("Opération ajoutée avec succès !"); 
      setValue(0); // réinitialise le champ montant
      setDescription(""); // réinitialise la description
      setTimeout(() => navigate(`/dashboard/accounts/${accountId}/operations`), 1000); // redirection après 1 seconde
    } catch (err) {
      console.error(err); // affiche l'erreur dans la console
      setMessage("Erreur lors de l'ajout de l'opération."); // message d'erreur affiché à l'utilisateur
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Nouvelle opération</h2>
      {message && <p className="mb-4 text-sm text-center text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4"> {/* formulaire contrôlé */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Montant (€)</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))} // met à jour le montant
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // met à jour la description
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
