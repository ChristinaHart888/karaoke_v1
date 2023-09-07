import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	onSnapshot,
} from "firebase/firestore";
import { firestore } from "../components/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import YouTube from "react-youtube";
import QueueItem from "../components/queueItem";
import useDb from "../hooks/useDb";
import MediaControl from "../components/mediaControl";
import he from "he";
import QRCode from "qrcode.react";

import styles from "../styles/room.module.css";

const Room = () => {
	const [host, setHost] = useState("");
	const [playlist, setPlaylist] = useState([]);
	const [roomMembers, setRoomMembers] = useState([""]);
	const [roomName, setRoomName] = useState("Room");
	const [isPlaying, setIsPlaying] = useState(false);
	const [searchBar, setSearchBar] = useState("");
	const [query, setQuery] = useState("");
	const [suggestedVideos, setSuggestedVideos] = useState([]);
	const [isEnded, setIsEnded] = useState();
	const [localStorageAPIKey, setLocalStorageAPIKey] = useState(null);
	const [roomExists, setRoomExists] = useState(null);
	const playerRef = useRef(null);
	const cachedResults = useMemo(() => new Map(), []);
	const [inviteLink, setInviteLink] = useState();
	const [userID, setUserID] = useState("");
	const [roomId, setRoomId] = useState("");
	const { removeMember, addToQueue, removeFromQueue } = useDb();
	const inviteModal = useRef();

	const PROD_URL = "https://karaoke-v1-git-master-christinahart888.vercel.app";

	useEffect(() => {
		const getSuggestedVideos = async () => {
			if (!query) {
				setSuggestedVideos([]);
			} else if (cachedResults.has(query) && cachedResults.get(query)) {
				setSuggestedVideos(cachedResults.get(query));
			} else {
				const data = await fetchSuggestedVideos(query);
				cachedResults.set(query, data);
				setSuggestedVideos(data);
			}
		};

		getSuggestedVideos();
	}, [query, cachedResults]);

	const initRoom = async () => {
		let apiKey = localStorage.getItem("apiKey");
		if (apiKey) {
			console.log("apiKey:", apiKey);
			setLocalStorageAPIKey(apiKey);
		}

		let isValidRoom = false;
		const roomID = localStorage.getItem("roomID");
		const getRooms = async () => {
			const querySnapshot = await getDocs(collection(firestore, "rooms"));

			querySnapshot.forEach((doc) => {
				if (roomID == doc.id) {
					setRoomExists(true);
					isValidRoom = true;
					const roomDetails = doc.data();
					setPlaylist(roomDetails.queue);
					setRoomMembers(roomDetails.members);
					setRoomName(roomDetails.roomName);
					setHost(roomDetails.createdBy);
					setInviteLink(PROD_URL + "/joinRoom?id=" + doc.id);
				}
			});
		};
		await getRooms();
		if (!isValidRoom) {
			setRoomExists(false);
		} else {
			const docRef = doc(firestore, "rooms", roomID);
			const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
				if (docSnapshot.exists()) {
					const data = docSnapshot.data();
					if (data) {
						console.log("Room Data:", data);
						setRoomMembers(data.members);
						setPlaylist(data.queue);
					}
				}
			});

			return () => {
				unsubscribe();
			};
		}
	};

	useEffect(() => {
		initRoom();
		setUserID(localStorage.getItem("userID"));
		setRoomId(localStorage.getItem("roomID"));
	}, []);

	useEffect(() => {
		if (roomExists === false) {
			console.log("Redir");
			localStorage.removeItem("roomID");
			window.location.href = "/searchRoom";
		}
	}, [roomExists]);

	const deleteRoom = async () => {
		const docRef = doc(firestore, "rooms", roomId);

		try {
			console.log("starting del");
			await deleteDoc(docRef);
			console.log("deleting");
		} catch (error) {
			console.error("error in deleting room. RoomID: " + roomId);
		}
	};

	const playVideo = (event) => {
		console.log("Playing Video");
		event.target.playVideo();
		const iframe = event.target.getIframe();
		iframe.style.width = "100%";
	};

	const playPause = () => {
		if (!isPlaying) {
			playerRef.current.internalPlayer.playVideo();
		} else {
			playerRef.current.internalPlayer.pauseVideo();
		}
	};

	const rewind = () => {
		//const duration = playerRef.current.internalPlayer.getDuration();
		playerRef.current.internalPlayer.seekTo(0);
	};

	const onPlay = () => {
		console.log("Playing");
		setIsPlaying(true);
		setIsEnded(false);
	};

	const onPause = () => {
		console.log("Pause");
		setIsPlaying(false);
	};

	const onEnd = async (event) => {
		removeFromQueue(0, roomId);
		console.log("event:", event);
		if (playlist[0] && event.target.className != "skip") {
			event.target.loadVideoById(playlist[0]);
		} else {
			setIsEnded(true);
		}
	};

	const addVideo = (item) => {
		const videoId = item.id.videoId;
		const title = item.snippet.title;
		const thumbnail = item.snippet.thumbnails.default.url;
		addToQueue(videoId, title, thumbnail, roomId);
	};

	const fetchSuggestedVideos = async (search) => {
		const apiKey = "AIzaSyAFQpD74U03NWIFoGd6i9nLLgX9-LUgyF4";
		const response = await fetch(`
            https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=${
							localStorageAPIKey ? localStorageAPIKey : apiKey
						}
        `);
		const data = await response.json();
		return data.items;
	};

	const handleSearchChange = (event) => {
		event.preventDefault();
		setQuery(searchBar);
		console.log(suggestedVideos);
	};

	const onSearchClick = (event, item) => {
		const videoId = event.currentTarget.id;
		console.log("Item: ", item);
		addVideo(item);
		setQuery("");
		setSearchBar("");
	};

	const leaveRoomHandler = async () => {
		if (host == userID) {
			await deleteRoom();
		} else {
			await removeMember(userID, roomId);
		}
		localStorage.removeItem("roomID");
		window.location.reload();
	};

	const opts = {
		playerVars: {
			autoplay: 1,
			playsinline: 1,
		},
	};

	return (
		<>
			<dialog
				ref={inviteModal}
				style={{
					minHeight: "560px",
					minWidth: "25em",
					boxSizing: "border-box",
					padding: "30px 30px 40px",
				}}
			>
				<div
					className="heading"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-around",
					}}
				>
					<h3 style={{ width: "100%" }}>Invite Members</h3>
					<div
						className={styles.cancelCross}
						onClick={() => inviteModal.current.close()}
					>
						<div className={styles.cancelLine}></div>
						<div className={styles.cancelLine}></div>
					</div>
				</div>

				<div
					className="qrCode"
					style={{
						width: "100%",
						justifyContent: "center",
						display: "flex",
					}}
				>
					{inviteLink && <QRCode value={inviteLink}></QRCode>}
					<div className="shareLink" style={{ marginLeft: "1.5em" }}>
						<div className={styles.inputContainer}>
							<input
								value={inviteLink}
								className={styles.inviteLinkInput}
								readOnly
							></input>
							<div
								className={styles.copyButton}
								onClick={() => navigator.clipboard.writeText(inviteLink)}
							>
								Copy
							</div>
						</div>
					</div>
				</div>
				<div onClick={() => inviteModal.current.close()}>Close</div>
			</dialog>
			<div
				style={{
					borderBottom: "1px solid black",
					fontFamily: "Arial",
					display: "flex",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					marginBottom: "1em",
				}}
			>
				<div
					className="roomName"
					style={{
						justifyContent: "flex-start",
						display: "flex",
						width: "100%",
						paddingLeft: "1em",
					}}
				>
					<h1>{roomName}</h1>
				</div>
				<div
					className="leave-btn"
					style={{ justifyContent: "flex-end", display: "flex", width: "100%" }}
				>
					<div
						style={{
							backgroundColor: "gray",
							padding: "0.5em",
							textAlign: "center",
							borderRadius: "0.5em",
						}}
						onClick={() => {
							console.log(inviteLink);
							inviteModal.current.showModal();
						}}
					>
						Add members
					</div>
					<button
						style={{
							backgroundColor: "red",
							padding: "10px",
							height: "3em",
							color: "white",
							border: "1px solid white",
							borderRadius: "0.5em",
							fontWeight: "bold",
						}}
						onClick={leaveRoomHandler}
					>
						Leave Room
					</button>
				</div>
			</div>

			<div
				className="search-div"
				style={{
					justifyContent: "center",
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
				}}
			>
				<form
					onSubmit={handleSearchChange}
					style={{ width: "100%", display: "flex", justifyContent: "center" }}
				>
					<input
						type="text"
						placeholder="Search for videos"
						id="search-input"
						style={{
							width: "75%",
							padding: "10px",
							fontSize: "16px",
							boxSizing: "border-box",
						}}
						value={searchBar}
						onChange={() => setSearchBar(event.target.value)}
						autoComplete="none"
					/>
					<input
						type="submit"
						style={{
							width: "20%",
							padding: "10px",
							height: "auto",
							fontSize: "16px",
							boxSizing: "border-box",
						}}
						value="Search"
					/>
				</form>

				<ul style={{ listStyleType: "none", width: "100%" }}>
					{suggestedVideos &&
						suggestedVideos[0] &&
						suggestedVideos.map((item, index) => {
							return (
								<li
									key={"suggested-" + index}
									onClick={(e) => onSearchClick(e, item)}
									id={item.id.videoId}
									style={{ display: "flex", marginBottom: "0.1em" }}
								>
									<img src={item.snippet.thumbnails.default.url} />
									{he.decode(item.snippet.title)}
								</li>
							);
						})}
				</ul>
			</div>
			<div className={styles.dashboard}>
				<div className={styles.vid}>
					{host === userID && playlist[0] && (
						<div className="video-player" style={{ width: "100%" }}>
							<YouTube
								videoId={playlist[0].videoID}
								opts={opts}
								onReady={playVideo}
								onPlay={onPlay}
								onPause={onPause}
								onEnd={onEnd}
								ref={playerRef}
							/>
							<div
								className="controls"
								style={{
									display: "flex",
									width: "100%",
									justifyContent: "space-around",
								}}
							>
								<MediaControl callback={rewind} icon={"⏪︎"}></MediaControl>
								<MediaControl
									callback={playPause}
									icon={isPlaying ? "⏸︎" : " ⏵︎"}
								></MediaControl>
								<MediaControl
									callback={onEnd}
									icon={"⏩︎"}
									className="skip"
								></MediaControl>
							</div>
						</div>
					)}
					<div className="song-list">
						<h3>Now Playing</h3>
						<div className="queue" style={{ display: "grid" }}>
							{playlist.map((video, index) => {
								return (
									<>
										<QueueItem video={video} key={localStorageAPIKey} />
										{index == 0 && <h4>Up Next</h4>}
									</>
								);
							})}
						</div>
					</div>
				</div>
				<div className={styles.members}>
					<h3>Members</h3>
				</div>
			</div>
		</>
	);
};

export default Room;
