import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface Card {
  id: number;
  first_name: string;
  last_name: string;
  card_number: string;
  code: number;
}

export default function ClientCardsView() {
  const { user } = useAuth();
  const { accountId } = useParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || !accountId) return;

    axios
      .get(`http://localhost:3000/clients/${user.id}/account/${accountId}/cards`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setCards(res.data);
      })
      .catch((err) => {
        console.error("Erreur chargement cartes", err);
      });
  }, [accountId, user]);

  const createCard = () => {
    if (!user || !accountId) return;

    axios
      .post(
        `http://localhost:3000/clients/${user.id}/account/${accountId}/cards`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setMessage("Carte créée !");
        setCards((prev) => [...prev, res.data]);
      })
      .catch((err) => {
        setMessage("Erreur lors de la création");
        console.error(err);
      });
  };

  const deleteCard = (cardId: number) => {
    if (!user || !accountId) return;

    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette carte ?");
    if (!confirmDelete) return;

    axios
      .delete(`http://localhost:3000/clients/${user.id}/accounts/${accountId}/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(() => {
        setCards((prev) => prev.filter((c) => c.id !== cardId));
        setMessage("Carte supprimée.");
      })
      .catch((err) => {
        setMessage("Erreur lors de la suppression");
        console.error(err);
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Cartes bancaires</h2>

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
              className="border p-4 rounded bg-gray-50 shadow-sm flex justify-between items-center"
            >
              <div>
                <p><strong>Carte n° :</strong> {card.card_number}</p>
                <p><strong>Nom :</strong> {card.first_name} {card.last_name}</p>
                <p><strong>Code :</strong> {card.code}</p>
              </div>
              <button
                onClick={() => deleteCard(card.id)}
                className="text-red-600 hover:underline"
              >
                🗑️ Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
