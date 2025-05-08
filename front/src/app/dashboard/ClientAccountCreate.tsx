import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router";

export default function ClientAccountCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const createAccount = () => {
    if (!user) return;

    axios
      .post(
        `http://localhost:3000/clients/${user.id}/accounts`,
        {},
        
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Erreur lors de la création du compte :", error);
      });
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>
      <button
        onClick={createAccount}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
      >
        Confirmer la création
      </button>
    </div>
  );
}
