// src/app/backend/BackendCardsView.tsx
import axios from "axios";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Card {
  id: number;
  first_name: string;
  last_name: string;
  card_number: string;
  code: number;
}

export default function BackendCardsView() {
  const { user } = useAuth();
  const { clientId, accountId } = useParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || !accountId || !clientId) return;

    axios
      .get(`http://localhost:3000/clients/${clientId}/accounts/${accountId}/cards`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setCards(res.data))
      .catch((err) => console.error("Erreur chargement cartes", err));
  }, [clientId, accountId, user]);

  const createCard = () => {
    if (!user || !accountId || !clientId) return;

    axios
      .post(
        `http://localhost:3000/clients/${clientId}/accounts/${accountId}/cards`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((res) => {
        setCards((prev) => [...prev, res.data]);
        setMessage("Carte créée !");
      })
      .catch((err) => {
        setMessage("Erreur lors de la création");
        console.error(err);
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Cartes bancaires du compte n°{accountId}
      </h2>

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <button
        onClick={createCard}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        ➕ Ajouter une carte
      </button>

      {cards.length === 0 ? (
        <p className="text-gray-500">Aucune carte trouvée.</p>
      ) : (
        <ul className="space-y-4">
          {cards.map((card) => (
            <li
              key={card.id}
              className="border p-4 rounded bg-gray-50 shadow-sm"
            >
              <p><strong>Carte :</strong> {card.card_number}</p>
              <p><strong>Nom :</strong> {card.first_name} {card.last_name}</p>
              <p><strong>Code :</strong> {card.code}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
