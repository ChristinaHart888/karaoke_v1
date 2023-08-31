import { useEffect, useState } from "react";
import React from "react";
import he from "he";

const QueueItem = ({ video, key }) => {
	const [title, setTitle] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);

	useEffect(() => {
		const fetchData = () => {
			const videoInfo = getVideoInfo();
			if (videoInfo) {
				let decodedTitle = he.decode(videoInfo.videoTitle);
				setTitle(decodedTitle);
				setThumbnail(videoInfo.videoThumbnail);
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
		};
	};

	return (
		<div style={{ display: "flex", marginBottom: "0.1em" }}>
			<img src={thumbnail}></img>
			<p style={{ marginTop: 0, marginLeft: "0.5em" }}>{title}</p>
		</div>
	);
};

export default QueueItem;
