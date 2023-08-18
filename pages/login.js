import { useEffect } from "react";
import Layout from "../components/layout";
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth'
import { auth } from "../components/firestore";
import { v4 as uuiv4 } from 'uuid'
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
                localStorage.setItem("user", JSON.stringify(result))
                window.location.reload()
            }
        })
    }, [auth])

    const logInWithGoogleHandler = () => {
        signInWithRedirect(auth, provider)
    }

    const guestButtonHandler = () => {
        const uid = uuiv4()
        localStorage.setItem("userID", uid)
        localStorage.setItem("username", "guest")
        window.location.reload()
    }

    return ( 
        <Layout>
            <h1>Login</h1>
            <button onClick={logInWithGoogleHandler} disabled>
                Log in with Google
            </button>
            <button onClick={guestButtonHandler}>
                Continue as guest
            </button>
        </Layout>
     );
}
 
export default Login;