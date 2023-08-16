import { createContext } from "react";
import { useState } from "react";

export const UserContext = createContext()

const UserContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [user, setUser] = useState(null)

    const value = {
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser
    }
    
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserContextProvider