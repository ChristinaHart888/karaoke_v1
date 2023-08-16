import { useEffect, useState } from "react";
import { auth } from "../components/firestore";

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [email, setEmail] = useState('')
    const [profile, setProfile] = useState('')

    useEffect(() => {
        const user = auth.currentUser
        console.log(user)
        setIsLoggedIn(user !== null)
        if(user){
            setEmail(user.email)
            setProfile(user.photoURL)
        }
        
    }, [auth])

    const signOut = () => {
        auth.signOut().then(() => {
            localStorage.clear()
            window.location.reload()
        })
    }

    return {
        isLoggedIn,
        setIsLoggedIn,
        email,
        profile,
        signOut
    }
}

export default useAuth