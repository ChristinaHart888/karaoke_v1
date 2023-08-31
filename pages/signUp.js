import { useState } from "react";
import Layout from "../components/layout";
import styles from "../styles/signin.module.css";
import Link from "next/link";
import useAuth from "../hooks/useAuth";
import Popup from "../components/popup";

const signUp = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const { signUp } = useAuth();

	const signUpHandler = async () => {
		if (username && password) {
			const result = await signUp(email, username, password);
			console.log("result", result);
			if (result.userID) {
				localStorage.setItem("userID", result.userID);
				window.location.href = "./profile";
			} else if (result.error) {
				setErrorMessage(result.error);
				setTimeout(() => {
					setErrorMessage("");
				}, 5000);
			}
		}
	};

	return (
		<Layout>
			<div className={styles.container}>
				<div className={styles.loginBox}>
					<h1>Sign Up</h1>
					<form>
						<div className={styles.inputContainer}>
							<input
								type="email"
								id="email"
								placeholder=""
								className={styles.formInput}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></input>
							<label htmlFor="email" className={styles.label}>
								Email
							</label>
						</div>
						<div className={styles.inputContainer}>
							<input
								type="text"
								placeholder=""
								id="username"
								className={styles.formInput}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							></input>
							<label htmlFor="username" className={styles.label}>
								Username
							</label>
						</div>
						<div className={styles.inputContainer}>
							<input
								type="password"
								placeholder=""
								id="password"
								className={styles.formInput}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							></input>
							<label htmlFor="password" className={styles.label}>
								Password
							</label>
						</div>
					</form>
					<button onClick={signUpHandler} className={styles.formBtn}>
						Sign Up
					</button>
					<small>
						Already have an account?{" "}
						<Link href="./login" className={styles.signUpLink}>
							Login
						</Link>{" "}
						now!
					</small>
				</div>
				<Popup
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				></Popup>
			</div>
		</Layout>
	);
};

export default signUp;
