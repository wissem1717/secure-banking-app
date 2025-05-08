import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";

interface ClientData {
    date_of_birth: string
    deleted: false
    first_name: string
    id: number
    last_name: string
    role: string
    username: string
}

export function BackendClientsView() {
    const { user } = useAuth();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:3000/clients/`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
            console.log(response.data);
            setClients(response.data)
        })
        .catch((error) => {
            console.log(error);
        });
    }, [])

    return (
        <>
            
            <table className="w-full text-center border-2 border-black">
            <tr>
                <th colSpan={5}>Clients</th>
            </tr>
            <tr className="border-y-2 border-black">
                <th className="border-x-2 border-black">ID</th>
                <th className="border-x-2 border-black">Prénom</th>
                <th className="border-x-2 border-black">Nom</th>
                <th className="border-x-2 border-black">Role</th>
                <th className="border-x-2 border-black">Nom d'utilisateur</th>
                <th className="border-x-2 border-black">Actions</th>
            </tr>
            {
                clients.map((client) =>
                    <ClientElement client={client} />
                )
            }
            </table>
        </>
    )
    // TODO add client creation
}

function ClientElement({ client }: { client: ClientData }) {
    const navigate = useNavigate();
    return <tr>
        <td className="border-x-2 border-black">{client.id}</td>
        <td className="border-x-2 border-black">{client.first_name}</td>
        <td className="border-x-2 border-black">{client.last_name}</td>
        <td className="border-x-2 border-black">{client.role}</td>
        <td className="border-x-2 border-black">{client.username}</td>
        <td className="border-x-2 border-black">
            <button onClick={() => navigate(`/backend/client/${client.id}`)}>
                🔍
            </button>
        </td>
    </tr>
}