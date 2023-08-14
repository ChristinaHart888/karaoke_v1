import { useEffect, useState } from "react";
import Layout from "../components/layout";

const Profile = () => {

    const [apiKey, setApiKey] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        let localStorageAPIKey = localStorage.getItem("apiKey");
        const uid = localStorage.getItem("uid")
        if(localStorageAPIKey){
            setApiKey(localStorageAPIKey)
        }
        if(uid){
            setIsLoggedIn(true)
        }
    }, [])

    const saveChanges = () => {
        console.log(apiKey)
        localStorage.setItem("apiKey", apiKey);
    }

    const logOutHandler = () => {

    }

    const logInHandler = () => {
        window.location.href = "/login"
    }

    return ( 
    <Layout>
        <h1>Profile</h1>
        <input type="text" placeholder="API Key" defaultValue={apiKey} onChange={() => setApiKey(event.target.value)}></input>
        <button onClick={saveChanges}>Save</button>
        {isLoggedIn ? <button>Log Out</button> : <button onClick={logInHandler}>Log In</button>}
    </Layout> );
}
 
export default Profile;