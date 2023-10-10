import { useEffect, useState } from "react";
import { auth, firestore } from "../components/firestore";
import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
	getDoc,
	deleteDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { v4 as uuiv4 } from "uuid";

const useAuth = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(null);
	const [email, setEmail] = useState("");
	const [profile, setProfile] = useState("");

	const SALT_ROUNDS = 10;
	const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	useEffect(() => {
		const user = auth.currentUser;
		if (user) {
			setEmail(user.email);
			setProfile(user.photoURL);
			setIsLoggedIn(true);
		} else if (localStorage.getItem("userID")) {
			setIsLoggedIn(true);
		}
	}, [auth]);

	const signOut = async () => {
		const currentUserID = localStorage.getItem("userID");
		if (currentUserID) {
			const docRef = doc(firestore, "users", currentUserID);
			const docSnapshot = await getDoc(docRef);

			if (docSnapshot.exists() && docSnapshot.data().isGuest === true) {
				await deleteUser(currentUserID);
			}
		}
		auth.signOut().then(() => {
			localStorage.clear();
			window.location.reload();
		});
	};

	const isValidEmail = (email) => {
		return EMAIL_REGEX.test(email);
	};

	const signUp = async (email, username, password) => {
		try {
			if (!isValidEmail(email)) {
				return { error: "Please provide a valid email address!" };
			}
			const userRef = collection(firestore, "users");
			const q = query(userRef, where("email", "==", email));
			const querySnapshot = await getDocs(q);
			console.log("Size", querySnapshot.size);
			if (querySnapshot.size != 0) {
				return {
					error: "Account with that email already exists",
				};
			} else {
				const userID = uuiv4();
				const newPass = await bcrypt.hash(password, SALT_ROUNDS);
				console.log("New pass", newPass);
				if (newPass) {
					const data = {
						email: email,
						username: username,
						password: newPass,
						isGuest: false,
					};
					await setDoc(doc(firestore, "users", userID), data);
					console.log("UserID: ", userID);
					return {
						userID: userID,
					};
				}
			}
			console.log(querySnapshot.size);
			return {
				result: "none",
			};
		} catch (e) {
			return {
				error: e,
			};
		}
	};

	const guestLogin = async () => {
		const uid = uuiv4();
		const tag = uid.split("-")[3];
		const guestName = "Guest#" + tag;
		try {
			const data = {
				username: guestName,
				isGuest: true,
			};
			await setDoc(doc(firestore, "users", uid), data);
			return {
				userID: uid,
			};
		} catch (e) {
			return {
				error: e,
			};
		}
	};

	const login = async (email, password) => {
		if (!isValidEmail(email)) {
			return {
				error: "Email is not valid!",
			};
		}
		const userRef = collection(firestore, "users");
		const q = query(userRef, where("email", "==", email));
		let data = { error: "An error has occured" };
		const querySnapshot = await getDocs(q);
		if (querySnapshot.size < 1) {
			data = { error: "An account with that email doesn't exist" };
			return data;
		}
		await Promise.all(
			querySnapshot.docs.map(async (doc) => {
				const userData = doc.data();
				const passwordHash = userData.password;
				const userID = doc.id;
				const role = userData.isAdmin ? "admin" : "user";
				const result = await bcrypt.compare(password, passwordHash);
				data = result
					? { userID: userID, role: role }
					: { error: "Password is incorrect" };
				console.log("data", data);
			})
		);

		return data;
	};

	const deleteUser = async (userID) => {
		const docRef = doc(firestore, "users", userID);
		await deleteDoc(docRef);
	};

	const getUsername = async (userID) => {
		let uid = userID;
		if (!uid) {
			uid = localStorage.getItem("userID");
		}
		if (uid) {
			const docRef = doc(firestore, "users", uid);
			const docSnapshot = await getDoc(docRef);

			if (docSnapshot.exists()) {
				const username = docSnapshot.data().username;
				return username;
			} else {
				console.log("Not found");
			}
		}
		return null;
	};

	const isValidAccount = async (userID) => {
		const userRef = doc(firestore, "users", userID);
		const docSnapshot = await getDoc(userRef);
		const userData = docSnapshot.data();
		return userData === undefined;
	};

	const isAdmin = async (userID) => {
		const userRef = doc(firestore, "users", userID);
		const docSnapshot = await getDoc(userRef);
		const userData = docSnapshot.data();

		if (userData) {
		}
	};

	return {
		isLoggedIn,
		setIsLoggedIn,
		email,
		profile,
		login,
		guestLogin,
		signUp,
		signOut,
		getUsername,
		isValidAccount,
		isAdmin,
	};
};

export default useAuth;
