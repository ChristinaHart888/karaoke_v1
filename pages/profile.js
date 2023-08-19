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
        let key = apiKey
        if (apiKey == "1"){
            key = process.env.NEXT_PUBLIC_REACT_APP_API_KEY
        } else if (apiKey == "2"){
            key = process.env.NEXT_PUBLIC_REACT_APP_API_KEY_BACKUP
        } else if (apiKey == "3"){
            key = process.env.NEXT_PUBLIC_REACT_APP_API_KEY_BACKUP_TWO
        } else if (apiKey == '4'){
            key = process.env.NEXT_PUBLIC_REACT_APP_API_KEY_BACKUP_THREE
        }
        localStorage.setItem("apiKey", key);
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
        <input type="text" placeholder="API Key" defaultValue={apiKey} onChange={(event) => setApiKey(event.target.value)}></input>
        <button onClick={saveChanges}>Save</button>
        {isLoggedIn ? <button onClick={logOutHandler} style={{width: '60%', margin: '1em', color: 'white', backgroundColor: 'red', borderRadius: '15px', padding: '0.5em', border: '0.1em solid white'}}>Log Out</button> : <button onClick={logInHandler}>Log In</button>}
    </Layout> );
}
 
export default Profile;