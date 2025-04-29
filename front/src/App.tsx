import { RouterProvider } from "react-router";
import './index.css'
import { router } from './routes.ts'
import React, {useState, useEffect} from 'react';
import { userContext } from "./userContext.ts";
import axios from "axios";

const App: React.FC = () => {
    const [user, setUser] = useState<{
        id: number | null,
        token: string | null,
    }>({
        id: null,
        token: null,
    });

    useEffect(() => {
        //const user = {id:1, token:"adadada"};
        //sessionStorage.setItem('user', JSON.stringify(user));

        if (sessionStorage.user) {
            const userData: {id: number, token: string} = JSON.parse(sessionStorage.user);

            setUser({
                id: userData.id,
                token: userData.token,
            });
        }
    }, []);

    async function handleLogin(username: string, password: string) {
        try {
            console.log("login", username, password);
            const res = await axios.post("http://localhost:3000/login", {
                username,
                password,
            })
            console.log(res)
            return true;
        } catch {
            return false;
        }
    }

    async function handleLogout() {
        setUser({
            id: null,
            token: null
        });
        sessionStorage.removeItem("user");
    }

    const value: {
        user: {
            id: number | null,
            token: string | null
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