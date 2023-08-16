import { useEffect } from "react";
import Layout from "../components/layout";
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth'
import { auth } from "../components/firestore";
import useAuth from "../hooks/useAuth"

const Login = () => {
    const provider = new GoogleAuthProvider()

    useEffect(() => {
        if(localStorage.getItem("userID") != null){
            window.location.href = './profile'
        }
        
        getRedirectResult(auth)
        .then((result) => {
            console.log("Result: ", result)
            if(result != null){
                localStorage.setItem("userID", result.user.uid)
                localStorage.setItem("profile", result.user.photoURL)
                localStorage.setItem("username", result.user.displayName)
                localStorage.setItem("user", result)
                window.location.reload()
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