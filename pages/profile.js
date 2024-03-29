import { useEffect, useState } from "react";
import Layout from "../components/layout";
import useAuth from "../hooks/useAuth";

const Profile = () => {
	const [apiKey, setApiKey] = useState();
	const [isLoggedIn, setIsLoggedIn] = useState(null);
	const [username, setUsername] = useState("Guest");
	const { signOut, getUsername } = useAuth();

	useEffect(() => {
		let localStorageAPIKey = localStorage.getItem("apiKey");
		let userID = localStorage.getItem("userID");

		const handleUsername = async () => {
			const uname = await getUsername(userID);
			if (localStorageAPIKey) {
				setApiKey(localStorageAPIKey);
			}
			if (localStorage.getItem("userID") != null) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
			if (uname != null) {
				setUsername(uname);
			}
			if (isLoggedIn === false) {
				window.location.href = "./login";
			}
		};

		handleUsername();
	}, [isLoggedIn]);

	const saveChanges = () => {
		let key = apiKey;
		if (apiKey == "2") {
			key = process.env.NEXT_PUBLIC_REACT_APP_API_KEY_BACKUP;
		} else if (apiKey == "3") {
			key = process.env.NEXT_PUBLIC_REACT_APP_API_KEY_BACKUP_TWO;
		} else if (apiKey == "4") {
			key = process.env.NEXT_PUBLIC_REACT_APP_API_KEY_BACKUP_THREE;
		} else {
			key = process.env.NEXT_PUBLIC_REACT_APP_API_KEY;
		}
		localStorage.setItem("apiKey", key);
		window.location.reload();
	};

	const logOutHandler = () => {
		signOut();
	};

	const logInHandler = () => {
		window.location.href = "/login";
	};

	return (
		<Layout>
			<h1>Profile</h1>
			<p>Hello, {username}</p>
			<input
				type="text"
				placeholder="API Key"
				onChange={(event) => setApiKey(event.target.value)}
			></input>
			<p>Current API Key: {apiKey && apiKey}</p>
			<button onClick={saveChanges}>Save</button>
			<br></br>
			{isLoggedIn ? (
				<button
					onClick={logOutHandler}
					style={{
						width: "60%",
						margin: "1em",
						color: "white",
						backgroundColor: "red",
						borderRadius: "15px",
						padding: "0.5em",
						border: "0.1em solid white",
					}}
				>
					Log Out
				</button>
			) : (
				<button onClick={logInHandler}>Log In</button>
			)}
		</Layout>
	);
};

export default Profile;
