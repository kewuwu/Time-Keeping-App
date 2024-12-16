import React from "react";
import { useState } from "react";

const UserContext = React.createContext();


export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    const saveUsername = (username) => {
        localStorage.setItem('username', username);
        setUsername(username);
    };

    return (
        <UserContext.Provider value={{ username, setUsername: saveUsername }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => React.useContext(UserContext)