import { useEffect, useState } from "react";
import React from "react";
import he from "he";

const QueueItem = ({ video, key }) => {
	const [title, setTitle] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);
	const [username, setUsername] = useState(null);

	useEffect(() => {
		const fetchData = () => {
			const videoInfo = getVideoInfo();
			if (videoInfo) {
				let decodedTitle = he.decode(videoInfo.videoTitle);
				setTitle(decodedTitle);
				setThumbnail(videoInfo.videoThumbnail);
				setUsername(videoInfo.username);
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
				}}
			>
				<p style={{ marginTop: 0, marginLeft: "0.5em", height: "100%" }}>
					{title}
				</p>
				<small style={{ marginBottom: 0, marginLeft: "0.5em", height: "100%" }}>
					{username}
				</small>
			</div>
		</div>
	);
};

export default QueueItem;
