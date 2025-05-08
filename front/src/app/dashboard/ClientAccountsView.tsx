import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react"

export function ClientAccountsView() {
    const { user } = useAuth();
    const [comptes, setComptes] = useState();

    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:3000/clients/${user.id}/accounts`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
            console.log(response);
            setComptes(response.data)
        })
        .catch((error) => {
            console.log(error);
        });
    }, [])

    return (
        <div className="text-center w-full">
            <h1>Comptes</h1>
        </div>
    )
}
