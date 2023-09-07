import { useEffect, useState } from "react";
import Layout from "../components/layout";
import {
	GoogleAuthProvider,
	getAuth,
	getRedirectResult,
	signInWithRedirect,
} from "firebase/auth";
import { auth } from "../components/firestore";
import { v4 as uuiv4 } from "uuid";
import styles from "../styles/login.module.css";
import Link from "next/link";
import useAuth from "../hooks/useAuth";
import Popup from "../components/popup";

const Login = () => {
	const provider = new GoogleAuthProvider();
	const { login, guestLogin } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isDisabled, setIsDisabled] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("userID") != null) {
			window.location.href = "./profile";
		}

		getRedirectResult(auth).then((result) => {
			if (result != null) {
				localStorage.setItem("userID", result.user.uid);
				localStorage.setItem("profile", result.user.photoURL);
				localStorage.setItem("username", result.user.displayName);
				localStorage.setItem("user", JSON.stringify(result));
				window.location.reload();
			}
		});
	}, [auth]);

	const loginHandler = async () => {
		setIsDisabled(true);
		const result = await login(email, password);
		if (result.error) {
			setErrorMessage(result.error);
			// setTimeout(() => {
			//     setErrorMessage('')
			// }, 5000)
		} else {
			const userID = result.userID;
			localStorage.setItem("userID", userID);
			window.location.href = "./profile";
		}
		setIsDisabled(false);
	};

	const logInWithGoogleHandler = () => {
		signInWithRedirect(auth, provider);
	};

	const guestButtonHandler = () => {
		setIsDisabled(true);
		const guesthandler = guestLogin();
		guesthandler.then((result) => {
			setIsDisabled(false);
			if (result.error) {
				setErrorMessage(result.error);
			} else if (result.userID) {
				localStorage.setItem("userID", result.userID);
				window.location.reload();
			}
		});
	};

	return (
		<Layout>
			<div className={styles.container}>
				<div className={styles.loginBox}>
					<h1>Login</h1>
					<form>
						<div className={styles.inputContainer}>
							<input
								type="email"
								placeholder=""
								id="email"
								className={styles.formInput}
								onChange={(e) => setEmail(e.target.value)}
							></input>
							<label htmlFor="email" className={styles.label}>
								Email
							</label>
						</div>
						<div className={styles.inputContainer}>
							<input
								type="password"
								placeholder=""
								id="password"
								className={styles.formInput}
								onChange={(e) => setPassword(e.target.value)}
							></input>
							<label htmlFor="password" className={styles.label}>
								Password
							</label>
						</div>
					</form>
					<button
						onClick={loginHandler}
						className={styles.formBtn}
						id={styles.loginBtn}
						disabled={isDisabled}
					>
						Log In
					</button>
					<button
						onClick={logInWithGoogleHandler}
						className={styles.formBtn}
						id={styles.guestBtn}
						disabled
					>
						Log in with Google
					</button>
					<button
						onClick={guestButtonHandler}
						className={styles.formBtn}
						id={styles.guestBtn}
						disabled={isDisabled}
					>
						Continue as guest
					</button>
					<small>
						New to Karaoke-v1?{" "}
						<Link href="./signUp" className={styles.signUpLink}>
							Sign up
						</Link>{" "}
						now!
					</small>
				</div>
				<Popup
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
					timeout={5000}
				></Popup>
			</div>
		</Layout>
	);
};

export default Login;
