import { useAuth } from "@/hooks/useAuth"; // hook personnalisé pour l’authentification
import axios from "axios"; // pour faire des requêtes HTTP
import { useEffect, useState } from "react" // hooks React
import { useNavigate } from "react-router"; // pour rediriger vers d'autres pages

interface ClientData { // interface représentant un client
    date_of_birth: string
    deleted: false
    first_name: string
    id: number
    last_name: string
    role: string
    username: string
}

export function BackendClientsView() {
    const navigate = useNavigate(); // permet de rediriger
    const { user } = useAuth(); // récupère l’utilisateur connecté
    const [clients, setClients] = useState([]); // liste des clients

    useEffect(() => {
        if (!user) return; // sécurité : ne rien faire sans utilisateur

        axios.get(`http://localhost:3000/clients/`, {
            headers: { Authorization: `Bearer ${user.token}` } // ajoute le token dans l’en-tête
        })
        .then((response) => {
            console.log(response.data); // debug : affiche les données dans la console
            setClients(response.data) // met à jour le state avec les clients reçus
        })
        .catch((error) => {
            console.log(error); // affiche les erreurs éventuelles
        });
    }, [])

    return (
        <table className="w-full text-center border-2 border-black"> {/* tableau stylisé */}
            <tr>
                <th colSpan={6}>Clients</th>
            </tr>
            <tr className="border-y-2 border-black"> {/* en-têtes de colonnes */}
                <th className="border-x-2 border-black">ID</th>
                <th className="border-x-2 border-black">Prénom</th>
                <th className="border-x-2 border-black">Nom</th>
                <th className="border-x-2 border-black">Role</th>
                <th className="border-x-2 border-black">Nom d'utilisateur</th>
                <th className="border-x-2 border-black">Actions</th>
            </tr>
            {
                clients.map((client) =>
                    <ClientElement client={client} /> // affiche chaque client via un composant
                )
            }
            <tr className="border-y-2 border-black">
                <td colSpan={6} className="text-end">
                    <button className="bg-gray-500 hover:bg-gray-400 text-white font-medium py-0.5 px-2 rounded m-1" onClick={() => navigate("/backend/client/new")}>
                        Créer un client
                    </button>
                </td>
            </tr>
        </table>
    )
    // TODO add client creation
}

function ClientElement({ client }: { client: ClientData }) { // composant ligne client
    const navigate = useNavigate(); // permet la navigation dynamique
    return <tr>
        <td className="border-x-2 border-black">{client.id}</td>
        <td className="border-x-2 border-black">{client.first_name}</td>
        <td className="border-x-2 border-black">{client.last_name}</td>
        <td className="border-x-2 border-black">{client.role}</td>
        <td className="border-x-2 border-black">{client.username}</td>
        <td className="border-x-2 border-black">
            <button className="border-2 border-gray-500 hover:border-gray-300 hover:bg-gray-400 text-white font-medium py-0.5 px-1 rounded m-1" onClick={() => navigate(`/backend/client/${client.id}`)}>
                🔍
            </button>
        </td>
    </tr>
}
