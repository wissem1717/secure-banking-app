// src/app/backend/BackendCardsView.tsx
import axios from "axios"; // pour faire des requêtes HTTP
import { useParams } from "react-router"; // pour lire les paramètres d'URL (clientId, accountId)
import { useEffect, useState } from "react"; // hooks React
import { useAuth } from "@/hooks/useAuth"; // hook personnalisé pour accéder à l'utilisateur connecté

interface Card {
  id: number;
  first_name: string;
  last_name: string;
  card_number: string;
  code: number;
}

export default function BackendCardsView() {
  const { user } = useAuth(); // on récupère l'utilisateur connecté (et son token)
  const { clientId, accountId } = useParams(); // récupération des paramètres d'URL
  const [cards, setCards] = useState<Card[]>([]); // liste des cartes associées au compte
  const [message, setMessage] = useState(""); // message de succès ou d'erreur

  useEffect(() => {
    if (!user || !accountId || !clientId) return; // sécurité : on attend d’avoir tout avant d’appeler

    axios
      .get(`http://localhost:3000/clients/${clientId}/accounts/${accountId}/cards`, {
        headers: { Authorization: `Bearer ${user.token}` }, // envoie du token pour s’authentifier
      })
      .then((res) => setCards(res.data)) // on stocke les cartes reçues
      .catch((err) => console.error("Erreur chargement cartes", err));
  }, [clientId, accountId, user]); // relance si clientId/accountId/user changent

  const createCard = () => {
    if (!user || !accountId || !clientId) return;

    axios
      .post(
        `http://localhost:3000/clients/${clientId}/accounts/${accountId}/cards`,
        {}, // corps vide, les infos sont générées automatiquement
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((res) => {
        setCards((prev) => [...prev, res.data]); // on ajoute la carte dans la liste actuelle
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
