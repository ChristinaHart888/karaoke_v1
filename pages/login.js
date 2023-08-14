import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth'
import { auth } from "../components/firestore";

const Login = () => {

    const provider = new GoogleAuthProvider()
    const [isLoggedIn, setIsLoggedIn] = useState(false)


    useEffect(() => {
        const uid = localStorage.getItem("uid");
        if(uid){
                
        }
        
        getRedirectResult(auth)
        .then((result) => {
            if(result != null){
                localStorage.setItem("userID", result.user.uid)
            }
        })
    }, [])

    const logInWithGoogleHandler = () => {
        signInWithRedirect(auth, provider)
    }

    return ( 
        <Layout>
            <h1>Login</h1>
            <button onClick={logInWithGoogleHandler}>
                Log in with Google
            </button>
        </Layout>
     );
}
 
export default Login;