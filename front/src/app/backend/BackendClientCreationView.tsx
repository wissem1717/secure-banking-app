import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router";

interface newClientData {
    date_of_birth: string
    first_name: string
    last_name: string
    role: string
    username: string
    password: string
}

export function BackendClientCreationView() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [clientData, setClientData] = useState<newClientData>({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        role: "user",
        username: "",
        password: "",
    });

    function createUser() {
        if (!user) return;
        console.log(clientData)
        axios.post("http://localhost:3000/clients", clientData, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
            // TODO change to navigate to page of new user
            navigate("/backend/clients")
        })
        .catch(console.error)
    }

    return (
        <form className="border-2 border-gray-400 rounded p-2 py-1 w-fit mx-auto" onSubmit={(e) => {e.preventDefault(); createUser()}}>
            <table>
                <thead>
                    <tr>
                        <th colSpan={2}>Création d'un client</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <label className="m-1">Nom:</label>
                        </td>
                        <td>
                            <input
                                className="border-1 m-1 ml-1 rounded border-gray-400"
                                type="text" 
                                value={clientData.last_name}
                                onChange={(e) => setClientData({ ...clientData, last_name: e.target.value})}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Prénom:</label>
                        </td>
                        <td>
                            <input
                                className="border-1 m-1 rounded border-gray-400"
                                type="text" 
                                value={clientData.first_name}
                                onChange={(e) => setClientData({ ...clientData, first_name: e.target.value})}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Date de naissance:</label>
                        </td>
                        <td>
                            <input
                                className="border-1 m-1 rounded border-gray-400"
                                type="date" 
                                value={clientData.date_of_birth}
                                onChange={(e) => setClientData({ ...clientData, date_of_birth: e.target.value})}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Rôle:</label>
                        </td>
                        <td>
                            <select className="border-1 m-1 rounded border-gray-400" value={clientData.role} onChange={(e) => setClientData({ ...clientData, role: e.target.value})}>
                                <option value="user">Utilisateur</option>
                                <option value="employee">Employé</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Nom d'utilisateur:</label>
                        </td>
                        <td>
                        <input
                            className="border-1 m-1 rounded border-gray-400"
                            type="text" 
                            value={clientData.username}
                            onChange={(e) => setClientData({ ...clientData, username: e.target.value})}
                        />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Mot de passe:</label>
                        </td>
                        <td>
                            <input
                                className="border-1 m-1 rounded border-gray-400"
                                type="text" 
                                value={clientData.password}
                                onChange={(e) => setClientData({ ...clientData, password: e.target.value})}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="text-end">
                            <button type="submit" className="bg-gray-500 hover:bg-gray-400 text-white font-medium py-0.5 px-2 rounded m-1 mt-1.5" onClick={() => navigate("/backend/client/new")}>
                                Créer un client
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
    // TODO add client creation
}