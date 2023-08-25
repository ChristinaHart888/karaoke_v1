import { useState } from "react";
import Layout from "../components/layout";
import styles from '../styles/signin.module.css'
import Link from "next/link";

const signUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const signUpHandler = () => {
        
    }

    return ( 
        <Layout>
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <h1>Sign Up</h1>
                    <form>
                        <input type="text" placeholder="Username" className={styles.formInput} value={username} onChange={e => setUsername(e.target.value)}></input><br></br>
                        <input type="password" placeholder="Password" className={styles.formInput} value={password} onChange={e => setPassword(e.target.value)}></input>
                    </form>
                    <button onClick={signUpHandler} className={styles.formBtn}>
                        Sign Up
                    </button>
                    <small>Already have an account? <Link href="./login" className={styles.signUpLink}>Login</Link> now!</small>
                </div>
            </div>
        </Layout>
    );
}
 
export default signUp;