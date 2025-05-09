import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router";

interface ClientData {
    date_of_birth: string
    deleted: false
    first_name: string
    id: number
    last_name: string
    role: string
    username: string
}

interface AccountData {
    "id": number,
    "balance": number,
    "client_id": number,
    "deleted": boolean
}

export function BackendClientView() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams();
    const [clientData, setClientData] = useState<ClientData>({
        date_of_birth: "",
        deleted: false,
        first_name: "",
        id: 0,
        last_name: "",
        role: "",
        username: ""
    });
    const [clientAccounts, setClientAccounts] = useState<Array<AccountData>>([]);

    function editUser() {
        if (!user) return;
        axios.put(`http://localhost:3000/clients/${id}`, clientData, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
            navigate(`/backend/client/${response.data.id}`)
        })
        .catch(console.error)
    }

    function deleteUser() {
        if (!user) return;
        axios.delete(`http://localhost:3000/clients/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then(() => {
            navigate(`/backend/clients`)
        })
        .catch(console.error)
    }

    function createAccount() {
        if (!user) return;
        axios.post(`http://localhost:3000/clients/${id}/accounts`, {}, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => setClientAccounts([...clientAccounts, response.data]))
    }

    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:3000/clients/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
            setClientData({ ...response.data, date_of_birth: response.data.date_of_birth.split("T")[0] })
            axios.get(`http://localhost:3000/clients/${id}/accounts`, {
                headers: { Authorization: `Bearer ${user.token}` }
            }).then((response) => setClientAccounts(response.data))
        })
        .catch((error) => {
            console.error(error);
        });
    }, [])

    return (
        <div>
        <form className="border-2 border-gray-400 rounded p-2 py-1 w-fit mx-auto" onSubmit={(e) => {e.preventDefault(); editUser()}}>
            <table>
                <thead>
                    <tr>
                        <th colSpan={2}>Profil Client</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <label className="m-1">ID:</label>
                        </td>
                        <td className="pl-1">{clientData.id}</td>
                    </tr>
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
                            <select className="border-1 m-1 rounded border-gray-400" value={clientData.role} disabled={true}>
                                <option value="user">Utilisateur</option>
                                <option value="employee">Employé</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Nom d'utilisateur:</label>
                        </td>
                        <td className="pl-1">{clientData.username}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="text-end">
                            <button type="submit" className="bg-gray-500 hover:bg-gray-400 text-white font-medium py-0.5 px-2 rounded m-1 mt-1.5">
                                Modifier
                            </button>
                            <button type="button" className="bg-red-500 hover:bg-red-400 text-white font-medium py-0.5 px-2 rounded m-1 mt-1.5" onClick={() => deleteUser()}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
        <div className="border-2 border-gray-400 rounded p-2 py-1 w-fit mx-auto">
            <table>
                <thead>
                    <tr>
                        <th colSpan={3} className="border-2 border-gray-400">Comptes</th>
                    </tr>
                    <tr>
                        <th className="px-1.5 border-2 border-gray-400">ID</th>
                        <th className="px-1.5 border-2 border-gray-400">Solde</th>
                        <th className="px-1.5 border-2 border-gray-400">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (clientAccounts.length == 0)? <tr><td colSpan={3} className="px-2 text-center border-2 border-gray-400">Aucun compte.</td></tr> : clientAccounts.map((account) =>
                            <ClientElement account={account} />
                        )
                    }
                    <tr className="px-1.5 border-2 border-gray-400">
                        <td colSpan={6} className="text-end">
                            <button className="bg-gray-500 hover:bg-gray-400 text-white font-medium py-0.5 px-2 rounded m-1" onClick={() => createAccount()}>
                                Créer un compte
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    )
    // TODO add client creation
}

function ClientElement({ account }: { account: AccountData }) {
  const navigate = useNavigate();
  return (
    <tr key={account.id.toString()}>
      <td className="px-2 text-center border-2 border-gray-400">{account.id}</td>
      <td className="px-2 text-right border-2 border-gray-400">{account.balance}</td>
      <td className="px-2 text-center border-2 border-gray-400 space-x-1">
        <button
          className="border-2 border-gray-500 hover:border-gray-300 hover:bg-gray-400 text-white font-medium py-0.5 px-1 rounded"
          onClick={() => navigate(`/backend/client/${account.client_id}/account/${account.id}`)}
        >
          🔍
        </button>
        <button
          className="border-2 border-green-500 hover:border-green-300 hover:bg-green-100 text-green-700 font-medium py-0.5 px-1 rounded"
          onClick={() => navigate(`/backend/client/${account.client_id}/account/${account.id}/cards`)}
        >
          💳
        </button>
      </td>
    </tr>
  );
}
