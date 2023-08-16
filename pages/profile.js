import { useEffect, useState } from "react";
import Layout from "../components/layout";
import useAuth from "../hooks/useAuth";

const Profile = () => {
    const [apiKey, setApiKey] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const { signOut } = useAuth()
 
    useEffect(() => {
        let localStorageAPIKey = localStorage.getItem("apiKey");
        if(localStorageAPIKey){
            setApiKey(localStorageAPIKey)
        }
        console.log(localStorage.getItem("userID"))
        if(localStorage.getItem("userID") != null){
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
        if(isLoggedIn === false){
            window.location.href = './login'
        }
    }, [isLoggedIn])

    const saveChanges = () => {
        console.log(apiKey)
        localStorage.setItem("apiKey", apiKey);
    }

    const logOutHandler = () => {
        signOut()
    }

    const logInHandler = () => {
        window.location.href = "/login"
    }

    return ( 
    <Layout>
        <h1>Profile</h1>
        <input type="text" placeholder="API Key" defaultValue={apiKey} onChange={() => setApiKey(event.target.value)}></input>
        <button onClick={saveChanges}>Save</button>
        {isLoggedIn ? <button onClick={logOutHandler}>Log Out</button> : <button onClick={logInHandler}>Log In</button>}
    </Layout> );
}
 
export default Profile;