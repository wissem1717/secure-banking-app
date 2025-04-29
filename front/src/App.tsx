import { RouterProvider } from "react-router";
import './index.css'
import { router } from './routes.ts'
import React, {useState, useEffect} from 'react';
import { userContext } from "./userContext.ts";
import axios from "axios";

// Add providers to app
const App: React.FC = () => {
    const [user, setUser] = useState<{
        id: number | null,
        token: string | null,
        role: string | null
    }>({
        id: null,
        token: null,
        role: null
    });

    useEffect(() => {
        //const user = {id:1, token:"adadada"};
        //sessionStorage.setItem('user', JSON.stringify(user));

        if (sessionStorage.user) {
            const userData: {id: number, token: string, role: string} = JSON.parse(sessionStorage.user);

            setUser({
                id: userData.id,
                token: userData.token,
                role: userData.role,
            });
        }
    }, []);

    async function handleLogin(username: string, password: string) {
        console.log("login", username, password);
        return await axios.post("http://localhost:3000/login", {
            username,
            password,
        }).then(response => {
            const data = {
                id: response.data.id,
                token: response.data.token,
                role: response.data.role
            }
            setUser(data);
            sessionStorage.setItem("user", JSON.stringify(data))
        }).catch(console.log)
    }

    async function handleLogout() {
        setUser({
            id: null,
            token: null,
            role: null
        });
        sessionStorage.removeItem("user");
    }

    const value: {
        user: {
            id: number | null,
            token: string | null,
            role: string | null
        },
        loginUser: ((username: string, password: string) => void),
        logoutUser: (() => void)
    } = {
        user: user,
        loginUser: handleLogin,
        logoutUser: handleLogout
    }

    return (
        <userContext.Provider value={value}>
            <RouterProvider router={router} />
        </userContext.Provider>
    )
}

export default App;