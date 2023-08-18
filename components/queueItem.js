import { useEffect, useState } from "react";
import React from "react";

const QueueItem = ({videoID, key}) => {
    const [title, setTitle] = useState();
    const [thumbnail, setThumbnail] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const videoInfo = await getVideoInfo();
            if(videoInfo){
                setTitle(videoInfo.videoTitle)
                setThumbnail(videoInfo.videoThumbnail)
            }
        }
        fetchData()
    })

    const getVideoInfo = async () => {
        const apiKeyEnv = process.env.NEXT_PUBLIC_REACT_APP_API_KEY;
        console.log("env", apiKeyEnv)
        let apiKey = "AIzaSyAFQpD74U03NWIFoGd6i9nLLgX9-LUgyF4"
        if(key){
            apiKey = key
        }
        const response = await fetch(`
            https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${apiKey}`)
        if(response.ok) {
            const data = await response.json();

            const videoTitle = data.items[0].snippet.title;
            const thumbnail = data.items[0].snippet.thumbnails.default.url;

            return {videoTitle: videoTitle, videoThumbnail: thumbnail}
        } else {
            console.error("Failed to retrieve data for youtube video ID: " + videoID);
            console.log(response)
            return null;
        }
    }

    return ( 
    <div style={{display: 'flex', marginBottom: '0.1em'}}>
        <img src={thumbnail}></img>
        <p style={{marginTop: 0, marginLeft: "0.5em"}}>{title}</p>
    </div> );
}
 
export default QueueItem;