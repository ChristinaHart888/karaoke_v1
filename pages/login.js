import { useEffect } from "react";
import Layout from "../components/layout";
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth'
import { auth } from "../components/firestore";
import { v4 as uuiv4 } from 'uuid'
import styles from '../styles/login.module.css'
import Link from "next/link";

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

    const logInHandler = () => {

    }

    const guestButtonHandler = () => {
        const uid = uuiv4()
        localStorage.setItem("userID", uid)
        localStorage.setItem("username", "guest")
        window.location.reload()
    }

    return ( 
        <Layout>
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <h1>Login</h1>
                    <form>
                        <label>Email</label>
                        <input type="text" placeholder="Email" className={styles.formInput}></input>
                        <label>Password</label>
                        <input type="password" placeholder="Password" className={styles.formInput}></input>
                    </form>
                    <button onClick={logInHandler} className={styles.formBtn} id={styles.loginBtn} disabled>
                        Log In
                    </button>
                    <button onClick={logInWithGoogleHandler} className={styles.formBtn} id={styles.guestBtn} disabled>
                        Log in with Google
                    </button>
                    <button onClick={guestButtonHandler} className={styles.formBtn} id={styles.guestBtn}>
                        Continue as guest
                    </button>
                    <small>New to Karaoke-v1? <Link href="./signUp" className={styles.signUpLink}>Sign up</Link> now!</small>
                </div>
            </div>
        </Layout>
     );
}
 
export default Login;