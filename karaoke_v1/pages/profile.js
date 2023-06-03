import { useEffect, useState } from "react";
import Layout from "../components/layout";

const Profile = () => {

    const [apiKey, setApiKey] = useState();

    useEffect(() => {
        let localStorageAPIKey = localStorage.getItem("apiKey");
        if(localStorageAPIKey){
            setApiKey(localStorageAPIKey)
        }
    }, [])

    const saveChanges = () => {
        console.log(apiKey)
        localStorage.setItem("apiKey", apiKey);
    }

    return ( 
    <Layout>
        <h1>Profile</h1>
        <input type="text" placeholder="API Key" defaultValue={apiKey} onChange={() => setApiKey(event.target.value)}></input>
        <button onClick={saveChanges}>Save</button>
    </Layout> );
}
 
export default Profile;