import { useAuth } from "@/hooks/useAuth"; // hook pour accéder à l'utilisateur connecté et son token
import axios from "axios"; // pour faire les requêtes HTTP à l’API
import { useParams, useNavigate } from "react-router"; // pour récupérer l'ID du compte source et naviguer
import { useState } from "react"; // pour gérer les champs du formulaire et le message

export default function ClientTransferView() {
  const { user } = useAuth(); // utilisateur connecté
  const { accountId } = useParams(); // ID du compte source (celui qui envoie l'argent)
  const navigate = useNavigate(); // permet de rediriger après le virement

  const [destAccountId, setDestAccountId] = useState(""); // ID du compte destinataire
  const [amount, setAmount] = useState(""); // montant à transférer
  const [description, setDescription] = useState(""); // description facultative du virement
  const [message, setMessage] = useState(""); // message de retour (succès ou erreur)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault(); // empêche le rechargement de la page
    if (!user || !accountId || !destAccountId || !amount) return; // vérifie que tout est bien rempli

    const val = parseFloat(amount); // convertit le montant en nombre
    if (val <= 0) { // empêche les montants négatifs ou nuls
      setMessage("Le montant doit être supérieur à 0.");
      return;
    }

    try {
      // Débit du compte source
      await axios.post(
        `http://localhost:3000/clients/${user.id}/accounts/${accountId}/operations`,
        { value: -val, desc: description || "Virement sortant" }, // on envoie un montant négatif
        { headers: { Authorization: `Bearer ${user.token}` } } // en-tête avec le token
      );

      // Crédit du compte destination (aucune vérification ici : à améliorer !)
      await axios.post(
        `http://localhost:3000/clients/${user.id}/accounts/${destAccountId}/operations`,
        { value: val, desc: description || "Virement reçu" }, // montant positif sur l'autre compte
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setMessage("✅ Virement effectué !"); // succès
      setTimeout(() => navigate("/dashboard"), 1500); // redirection vers le tableau de bord après 1,5 sec
    } catch (error) {
      console.error("Erreur virement", error); // log en cas d'erreur
      setMessage("❌ Erreur lors du virement."); // message d’erreur affiché à l’utilisateur
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Virement vers un autre compte</h2>

      {message && <p className="mb-4 text-blue-700">{message}</p>}

      <form onSubmit={handleTransfer} className="space-y-4"> {/* formulaire d'envoi */}
        <div>
          <label className="block mb-1">Numéro du compte destinataire</label>
          <input
            type="number"
            value={destAccountId}
            onChange={(e) => setDestAccountId(e.target.value)} // met à jour l'ID du compte destinataire
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Montant (€)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} // met à jour le montant
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // met à jour la description
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          💸 Effectuer le virement
        </button>
      </form>
    </div>
  );
}
