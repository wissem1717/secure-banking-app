import { useAuth } from "@/hooks/useAuth"; // pour accéder à l'utilisateur connecté et son token
import axios from "axios"; // pour envoyer les requêtes à l'API
import { useEffect, useState } from "react"; // hooks pour gérer les états et les effets
import { useParams } from "react-router"; // pour récupérer l'ID du compte depuis l'URL

interface Card {
  id: number; // identifiant de la carte
  first_name: string; // prénom du titulaire
  last_name: string; // nom du titulaire
  card_number: string; // numéro de la carte
  code: number; // code de sécurité de la carte
}

export default function ClientCardsView() {
  const { user } = useAuth(); // utilisateur connecté
  const { accountId } = useParams(); // identifiant du compte depuis l’URL
  const [cards, setCards] = useState<Card[]>([]); // liste des cartes associées au compte
  const [message, setMessage] = useState(""); // message à afficher (succès ou erreur)

  useEffect(() => {
    if (!user || !accountId) return; // sécurité : stoppe si info manquante

    axios
      .get(`http://localhost:3000/clients/${user.id}/accounts/${accountId}/cards`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // envoie le token dans les headers pour s’authentifier
        },
      })
      .then((res) => {
        setCards(res.data); // enregistre la liste des cartes dans le state
      })
      .catch((err) => {
        console.error("Erreur chargement cartes", err); // affiche une erreur si la requête échoue
      });
  }, [accountId, user]); // déclenche l’effet quand l’utilisateur ou le compte change

  const createCard = () => {
    if (!user || !accountId) return; // sécurité : ne fait rien si données manquantes

    axios
      .post(
        `http://localhost:3000/clients/${user.id}/accounts/${accountId}/cards`,
        {}, // aucune donnée à envoyer ici, l'API gère la génération
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // token envoyé pour sécuriser l'accès
          },
        }
      )
      .then((res) => {
        setMessage("Carte créée !"); // message de succès
        setCards((prev) => [...prev, res.data]); // ajoute la nouvelle carte à la liste existante
      })
      .catch((err) => {
        setMessage("Erreur lors de la création"); // message d’erreur
        console.error(err); // affiche l'erreur dans la console
      });
  };

  const deleteCard = (cardId: number) => {
    if (!user || !accountId) return; // sécurité

    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette carte ?"); // confirmation utilisateur
    if (!confirmDelete) return;

    axios
      .delete(`http://localhost:3000/clients/${user.id}/accounts/${accountId}/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // token requis pour autorisation
        },
      })
      .then(() => {
        setCards((prev) => prev.filter((c) => c.id !== cardId)); // supprime la carte du tableau local
        setMessage("Carte supprimée."); // message de confirmation
      })
      .catch((err) => {
        setMessage("Erreur lors de la suppression"); // message d'erreur
        console.error(err); // log de l’erreur
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Cartes bancaires</h2>

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <button
        onClick={createCard} // déclenche la création d’une nouvelle carte
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        ➕ Ajouter une carte
      </button>

      {cards.length === 0 ? ( // si aucune carte, affiche un message
        <p className="text-gray-500">Aucune carte trouvée.</p>
      ) : (
        <ul className="space-y-4">
          {cards.map((card) => ( // boucle sur chaque carte
            <li
              key={card.id}
              className="border p-4 rounded bg-gray-50 shadow-sm flex justify-between items-center"
            >
              <div>
                <p><strong>Carte n° :</strong> {card.card_number}</p> {/* numéro visible */}
                <p><strong>Nom :</strong> {card.first_name} {card.last_name}</p> {/* nom du titulaire */}
                <p><strong>Code :</strong> {card.code}</p> {/* code sécurité */}
              </div>
              <button
                onClick={() => deleteCard(card.id)} // supprime la carte
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
