import { useAuth } from "@/hooks/useAuth"; // permet de récupérer l'utilisateur connecté (et son token)
import axios from "axios"; // pour envoyer une requête POST à l'API
import { useNavigate } from "react-router"; // pour rediriger après la création

export default function ClientAccountCreate() {
  const { user } = useAuth(); // utilisateur actuellement connecté
  const navigate = useNavigate(); // fonction de redirection vers une autre page

  const createAccount = () => {
    if (!user) return; // sécurité : ne rien faire si aucun utilisateur

    axios
      .post(
        `http://localhost:3000/clients/${user.id}/accounts`, // route API pour créer un compte
        {}, // aucun corps spécifique envoyé ici
        {
          headers: { Authorization: `Bearer ${user.token}` }, // en-tête sécurisé avec le token
        }
      )
      .then(() => {
        navigate("/dashboard"); // redirige vers la page des comptes après création
      })
      .catch((error) => {
        console.error("Erreur lors de la création du compte :", error); // log en cas d'erreur
      });
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>
      <button
        onClick={createAccount} // déclenche la création du compte à l'API
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
      >
        Confirmer la création
      </button>
    </div>
  );
}
