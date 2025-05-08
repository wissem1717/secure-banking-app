import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";

export default function ClientTransferView() {
  const { user } = useAuth();
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [destAccountId, setDestAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accountId || !destAccountId || !amount) return;

    const val = parseFloat(amount);
    if (val <= 0) {
      setMessage("Le montant doit être supérieur à 0.");
      return;
    }

    try {
      // Débit du compte source
      await axios.post(
        `http://localhost:3000/clients/${user.id}/accounts/${accountId}/operations`,
        { value: -val, desc: description || "Virement sortant" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Crédit du compte destination (aucune vérification ici : à améliorer !)
      await axios.post(
        `http://localhost:3000/clients/${user.id}/accounts/${destAccountId}/operations`,
        { value: val, desc: description || "Virement reçu" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setMessage("✅ Virement effectué !");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Erreur virement", error);
      setMessage("❌ Erreur lors du virement.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Virement vers un autre compte</h2>

      {message && <p className="mb-4 text-blue-700">{message}</p>}

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block mb-1">Numéro du compte destinataire</label>
          <input
            type="number"
            value={destAccountId}
            onChange={(e) => setDestAccountId(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Montant (€)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
