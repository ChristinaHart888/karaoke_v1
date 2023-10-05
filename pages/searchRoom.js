import Layout from "../components/layout";
import Modal from "../components/Modal";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../components/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";
import useDb from "../hooks/useDb";
import useAuth from "../hooks/useAuth";

const SearchRoom = () => {
	const [rooms, setRooms] = useState();
	const [newRoomName, setNewRoomName] = useState("");
	const [username, setUsername] = useState("");
	const [userID, setUserID] = useState();
	const [modalDisplay, setModalDisplay] = useState(false);

	const { addMember, getRooms } = useDb();
	const { getUsername } = useAuth();

	useEffect(() => {
		getRooms(setRooms);
		const roomId = localStorage.getItem("roomID");
		if (roomId) {
			window.location.href = "./room";
		}
		setUserID(localStorage.getItem("userID"));
		const uname = getUsername();
		uname.then((name) => {
			console.log("Name", name);
			setUsername(name);
		});
	}, []);

	const selectRoomHandler = async (event) => {
		const roomId = event.currentTarget.id;
		if (userID == null) {
			window.location.href = "./login";
		}

		await addMember({ userID: userID, roomID: roomId, username: username });
		localStorage.setItem("roomID", roomId);
		window.location.href = "./room";
	};

	const createRoom = async (e) => {
		e.preventDefault();
		try {
			const userID = localStorage.getItem("userID");
			if (userID == null) {
				window.location.href = "./login";
			}
			const newRoom = await addDoc(collection(firestore, "rooms"), {
				createdBy: userID,
				roomName: newRoomName,
				members: [{ userID, username }],
				doneMembers: [],
				takeTurns: false,
				queue: [],
			});
			console.log("New room id: " + newRoom.id);
			localStorage.setItem("roomID", newRoom.id);
		} catch (e) {
			console.error(e);
			alert("An error occured when creating room");
		}
		window.location.href = "./room";
	};

	const createRoomModalHandler = () => {
		setModalDisplay(true);
	};

	const destroyModalHandler = () => {
		setModalDisplay(false);
	};

	const NewRoomForm = () => {
		return (
			<form onSubmit={createRoom}>
				<label>Room Name</label>
				<input
					type="text"
					placeholder="Room Name"
					onChange={(e) => setNewRoomName(e.target.value)}
					value={newRoomName}
				></input>
				<button type="submit">Submit</button>
			</form>
		);
	};

	return (
		<Layout>
			<h1>Search Room</h1>
			<Modal
				isOpen={modalDisplay}
				onClose={destroyModalHandler}
				createRoom={createRoom}
				setNewRoomName={setNewRoomName}
			></Modal>
			<div
				className="roomList"
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
			>
				{rooms &&
					rooms.map((room) => {
						const roomData = room.data();
						const roomName = roomData.roomName;
						return (
							<div
								id={room.id}
								key={room.id}
								onClick={selectRoomHandler}
								style={{
									backgroundColor: "#333",
									color: "white",
									textAlign: "center",
									fontWeight: "bold",
									margin: "1em",
									border: "1px solid black",
									width: "auto",
									padding: "1em",
									fontSize: "large",
									borderRadius: "0.5em",
								}}
							>
								{roomName}
							</div>
						);
					})}
			</div>
			<button onClick={createRoomModalHandler}>Create Room</button>
		</Layout>
	);
};

export default SearchRoom;
