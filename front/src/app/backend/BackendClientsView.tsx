import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react"

export function BackendClientsView() {
    const { user } = useAuth();
    const [clients, setClients] = useState();

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
            <h1>Clients</h1>
            <p>{JSON.stringify(clients)}</p>
        </>
    )
}
