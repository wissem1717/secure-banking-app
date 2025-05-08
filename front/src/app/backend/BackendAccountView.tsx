import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useState, useEffect } from "react";
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
    id: number,
    balance: number,
    client_id: number,
    deleted: boolean
}

interface TransactionData {
    id: number,
    value: number,
    description: string,
    account_id: number
}

export function BackendAccountView() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { clientId, accountId } = useParams();
    const [clientData, setClientData] = useState<ClientData>({
        date_of_birth: "",
        deleted: false,
        first_name: "",
        id: 0,
        last_name: "",
        role: "",
        username: ""
    });
    const [accountData, setAccountData] = useState<AccountData>({
        id: 0,
        balance: 0,
        client_id: 0,
        deleted: false
    });
    const [accountTransactions, setAccountTransactions] = useState<Array<TransactionData>>([]);
    const [transactionData, setTransactionData] = useState<TransactionData>({
        account_id: accountId ? parseInt(accountId): -1,
        description: "",
        id: -1,
        value: 0
    })

    function deleteAccount() {
        if (!user) return;
        axios.delete(`http://localhost:3000/clients/${clientId}/accounts/${accountId}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then(() => {
            navigate(`/backend/client/${clientId}`)
        })
        .catch(console.error)
    }

    function createTransaction() {
        if (!user) return;
        axios.post(`http://localhost:3000/clients/${clientId}/accounts/${accountId}/operations`, transactionData, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then((response) => {
            setAccountTransactions([...accountTransactions, response.data])
            setAccountData({ ...accountData, balance: (accountData.balance + response.data.value) })
        })
    }

    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:3000/clients/${clientId}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
            setClientData({ ...response.data, date_of_birth: response.data.date_of_birth.split("T")[0] })
            axios.get(`http://localhost:3000/clients/${clientId}/accounts/${accountId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            }).then((response) => setAccountData(response.data))
            axios.get(`http://localhost:3000/clients/${clientId}/accounts/${accountId}/operations`, {
                headers: { Authorization: `Bearer ${user.token}` }
            }).then((response) => setAccountTransactions(response.data))
        })
        .catch((error) => {
            console.error(error);
        });
    }, [])

    return (
        <div>
        <div className="border-2 border-gray-400 rounded p-2 py-1 w-fit mx-auto">
            <table>
                <thead>
                    <tr>
                        <th colSpan={2}>Données du compte</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <label className="m-1">ID:</label>
                        </td>
                        <td className="pl-1">{accountData.id}</td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">ID client:</label>
                        </td>
                        <td className="pl-1">{accountData.client_id}</td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Nom:</label>
                        </td>
                        <td>
                            {clientData.first_name}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Prénom:</label>
                        </td>
                        <td>
                            {clientData.last_name}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Date de naissance:</label>
                        </td>
                        <td>
                            <input type="date" value={clientData.date_of_birth}></input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="m-1">Solde:</label>
                        </td>
                        <td>
                            {accountData.balance}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="text-end">
                            <button type="button" className="bg-red-500 hover:bg-red-400 text-white font-medium py-0.5 px-2 rounded m-1 mt-1.5" onClick={() => deleteAccount()}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="border-2 border-gray-400 rounded p-2 py-1 w-fit mx-auto">
            <table>
                <thead>
                    <tr>
                        <th colSpan={4} className="border-2 border-gray-400">Transactions</th>
                    </tr>
                    <tr>
                        <th className="px-1.5 border-2 border-gray-400">ID</th>
                        <th className="px-1.5 border-2 border-gray-400">Solde</th>
                        <th className="px-1.5 border-2 border-gray-400">Description</th>
                        <th className="px-1.5 border-2 border-gray-400">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (accountTransactions.length == 0)? <tr><td colSpan={4} className="px-2 text-center border-2 border-gray-400">Aucune transaction.</td></tr> : accountTransactions.map((transaction) =>
                            (clientId !== undefined && accountId !== undefined) ? <TransactionElement clientId={clientId} accountId={accountId} transaction={transaction} /> : undefined
                        )
                    }
                    <tr>
                        <td colSpan={4} className="p-2">
                            <label>Montant:</label><br/>
                            <input type="number" value={transactionData.value} onChange={(e) => {setTransactionData({ ...transactionData, value: parseInt(e.target.value)})}} className="border-2 border-gray-400 rounded p-1 w-fit mx-auto"/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={4} className="p-2">
                            <label>Description:</label><br/>
                            <input type="text" value={transactionData.description} onChange={(e) => {setTransactionData({ ...transactionData, description: e.target.value})}} className="border-2 border-gray-400 rounded p-1 w-fit ml-1 mx-auto"/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={4} className="text-end">
                            <button className="bg-gray-500 hover:bg-gray-400 text-white font-medium py-0.5 px-2 rounded m-1" onClick={() => createTransaction()}>
                                Nouvelle transaction
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

function TransactionElement({ clientId, accountId, transaction }: { clientId: string, accountId: string, transaction: TransactionData }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    function deleteTransaction(transactionId: number) {
        if (!user) return;
        axios.delete(`http://localhost:3000/clients/${clientId}/accounts/${accountId}/operations/${transactionId}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(() => {
            navigate(0)
        })
    }

    return <tr key={transaction.id.toString()}>
        <td className="px-2 text-center border-2 border-gray-400">{transaction.id}</td>
        <td className="px-2 text-right border-2 border-gray-400">{transaction.value}</td>
        <td className="px-2 text-right border-2 border-gray-400">{transaction.description}</td>
        <td className="px-2 text-center border-2 border-gray-400">
            <button className="border-2 border-gray-500 hover:border-gray-300 hover:bg-gray-400 text-white font-medium py-0.5 px-1 rounded m-1" onClick={() => deleteTransaction(transaction.id)}>
                ❌
            </button>
        </td>
    </tr>
}
