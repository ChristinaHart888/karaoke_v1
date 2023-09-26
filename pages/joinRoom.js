import { useEffect, useState } from "react";
import Layout from "../components/layout";
import * as signInStyle from "../styles/signin.module.css";
import useDb from "../hooks/useDb";
import useAuth from "../hooks/useAuth";

const JoinRoom = () => {
	const [room, setRoom] = useState();
	const [username, setUsername] = useState();
	const { getRoomInfo } = useDb();
	const { isLoggedIn, getUsername } = useAuth();

	useEffect(() => {
		let queryString = window.location.search;
		const params = new URLSearchParams(queryString);

		const roomId = params.get("id");
		const roomInfo = getRoomInfo(roomId);
		roomInfo.then((result) => {
			console.log("res", result);
			setRoom(result);
		});
	}, []);

	useEffect(() => {
		console.log("Is logged in", isLoggedIn);
		let uname = getUsername();
		uname.then((result) => {
			console.log("res", result);
			if (result === null) {
				result = "guest";
			}
			isLoggedIn && setUsername(result);
		});
	}, [isLoggedIn]);

	return (
		<Layout>
			<div className={signInStyle.container}>
				<div className={signInStyle.loginBox}>
					<h2>
						{room
							? `You've been invited to join ${room.roomName}`
							: "Link expired"}
					</h2>
					{room && !isLoggedIn && (
						<div>
							<button>Login</button>
							<button>Continue as Guest</button>
						</div>
					)}
					{room && isLoggedIn && (
						<div>
							<button>Log in as {username}</button>
							<button>Log in with another account</button>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default JoinRoom;
