import { useEffect, useState } from "react";

const QueueItem = ({videoID}) => {
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
        //const apiKey = process.env.GOOGLE_API_KEY;
        const apiKey = "AIzaSyAkQcjBu24LNd_wRR_o1CExlF2Jf02V4Oo"
        console.log(apiKey)
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
    <>
    <img src={thumbnail}></img>
    {title}
    </> );
}
 
export default QueueItem;