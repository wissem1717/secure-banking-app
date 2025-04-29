import React from 'react';

const userContext = React.createContext<{
    user: {
        id: number | null,
        token: string | null
    },
    loginUser: ((username: string, password: string) => void),
    logoutUser: (() => void)
}>({
    user: {
        id: null,
        token: null
    },
    loginUser: () => {},
    logoutUser: () => {}
});

export { userContext };