import { useEffect, useState } from "react";
import Layout from "../components/layout";
import * as signInStyle from "../styles/signin.module.css";
import useDb from "../hooks/useDb";
import useAuth from "../hooks/useAuth";

const JoinRoom = () => {
	const [room, setRoom] = useState();
	const [roomID, setRoomID] = useState();
	const [username, setUsername] = useState();
	const [userID, setUserID] = useState();
	const { getRoomInfo, addMember } = useDb();
	const { isLoggedIn, getUsername } = useAuth();

	useEffect(() => {
		let queryString = window.location.search;
		const params = new URLSearchParams(queryString);

		const roomId = params.get("id");
		setRoomID(roomId);
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
			if (isLoggedIn) {
				setUsername(result);
				setUserID(localStorage.getItem("userID"));
			}
		});
	}, [isLoggedIn]);

	const joinRoomHandler = async () => {
		console.log("roomID", roomID);
		await addMember({ userID: userID, username: username, roomID: roomID });
		localStorage.setItem("roomID", roomID);
		window.location.href = "./room";
	};

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
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								marginBottom: "2em",
								marginTop: "auto",
							}}
						>
							<button
								className={signInStyle.formBtn}
								onClick={() =>
									(window.location.href = `./login?redir=${roomID}`)
								}
							>
								Login
							</button>
							<button className={signInStyle.formBtn} disabled>
								Continue as Guest
							</button>
						</div>
					)}
					{room && isLoggedIn && (
						<button
							className={signInStyle.formBtn}
							style={{ marginBottom: "2em", marginTop: "auto" }}
							onClick={joinRoomHandler}
						>
							Join as {username}
						</button>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default JoinRoom;
