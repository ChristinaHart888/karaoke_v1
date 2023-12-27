import { useEffect, useState } from "react";
import React from "react";
import he from "he";
import useDb from "../hooks/useDb";

const QueueItem = ({ video, index, roomID }) => {
	const [title, setTitle] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);
	const [username, setUsername] = useState(null);
	const [userID, setuserID] = useState(null);

	const { removeFromQueue, pushSong } = useDb();

	useEffect(() => {
		const fetchData = () => {
			const videoInfo = getVideoInfo();
			if (videoInfo) {
				let decodedTitle = he.decode(videoInfo.videoTitle);
				setTitle(decodedTitle);
				setThumbnail(videoInfo.videoThumbnail);
				setUsername(videoInfo.username);
				setuserID(videoInfo.userID);
			} else {
				setTitle(
					"Error, API Key has expired. Please exit the room and change it in the profile page."
				);
			}
		};
		fetchData();
	});

	const getVideoInfo = () => {
		return {
			videoTitle: video.videoTitle,
			videoThumbnail: video.videoThumbnail,
			username: video.username,
			userID: video.userID,
		};
	};

	return (
		<div style={{ display: "flex", marginBottom: "0.1em", height: "auto" }}>
			<img src={thumbnail} style={{}}></img>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch",
					width: "100%",
				}}
			>
				<div className="title">
					<p style={{ marginTop: 0, marginLeft: "0.5em", height: "100%" }}>
						{title}
					</p>
				</div>
				<div
					className="op"
					style={{
						marginBottom: 0,
						marginLeft: "0.5em",
						height: "100%",
						display: "flex",
					}}
				>
					<small
						style={{
							width: "100%",
							marginTop: "auto",
							marginBottom: "auto",
							color:
								localStorage.getItem("userID") === userID ? "green" : "white",
						}}
					>
						{username}
					</small>
					{(localStorage.getItem("userID") === userID ||
						localStorage.getItem("role") === "admin") &&
						index != 0 && (
							<div
								style={{
									width: "100%",
									textAlign: "end",
									paddingRight: "1em",
									justifyContent: "end",
									display: "flex",
								}}
							>
								{localStorage.getItem("role") === "admin" && (
									<div
										className="logo"
										style={{
											display: "inline-block",
											marginBottom: "auto",
											marginTop: "auto",
											backgroundColor: "#222",
											padding: "5px",
											borderRadius: "100VMAX",
										}}
										onClick={() => {
											pushSong({ roomID: roomID, index: index, newIndex: 1 });
										}}
									>
										🔝
									</div>
								)}
								<div
									className="logo"
									style={{
										display: "inline-block",
										marginBottom: "auto",
										marginTop: "auto",
										backgroundColor: "#222",
										padding: "5px",
										borderRadius: "100VMAX",
									}}
									onClick={() => {
										removeFromQueue(index, roomID);
									}}
								>
									🗑️
								</div>
							</div>
						)}
				</div>
			</div>
		</div>
	);
};

export default QueueItem;
