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
        const localApiKey = localStorage.getItem("apiKey")
        let apiKey
        if(localApiKey){
            apiKey = localApiKey;
        }else{
            apiKey = process.env.NEXT_PUBLIC_REACT_APP_API_KEY;
        }
        const response = await fetch(`
            https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${apiKey}`)
        if(response.ok) {
            const data = await response.json();

            const videoTitle = data.items[0].snippet.title;
            const thumbnail = data.items[0].snippet.thumbnails.default.url;

            return {videoTitle: videoTitle, videoThumbnail: thumbnail}
        } else if(response.status == "403") {
            console.error("Failed to retrieve data for youtube video ID: " + videoID);
            console.log(response)
            //alert("API Key Expired. Please use another one.")
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