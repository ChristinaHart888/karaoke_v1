import { useEffect, useState } from "react";
import Layout from "../components/layout";
import useAuth from "../hooks/useAuth";

const Profile = () => {
    const [apiKey, setApiKey] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [username, setUsername] = useState("Guest")
    const { signOut } = useAuth()
 
    useEffect(() => {
        let localStorageAPIKey = localStorage.getItem("apiKey");
        let uname = localStorage.getItem("username")

        if(localStorageAPIKey){
            setApiKey(localStorageAPIKey)
        }
        if(localStorage.getItem("userID") != null){
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
        if(uname != null){
            setUsername(uname)
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
        <p>Hello, {username}</p>
        <input type="text" placeholder="API Key" defaultValue={apiKey} onChange={() => setApiKey(event.target.value)}></input>
        <button onClick={saveChanges}>Save</button>
        {isLoggedIn ? <button onClick={logOutHandler} style={{width: '100%', margin: '1em', color: 'white', backgroundColor: 'red', borderRadius: '15px', padding: '0.5em', border: '0.1em solid white'}}>Log Out</button> : <button onClick={logInHandler}>Log In</button>}
    </Layout> );
}
 
export default Profile;