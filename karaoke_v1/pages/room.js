import Link from 'next/link'
import { collection, getDocs } from "firebase/firestore"; 
import { firestore } from "../components/firestore";
import { useEffect, useMemo, useRef, useState } from 'react';
import YouTube from 'react-youtube'
import Layout from '../components/layout';
import QueueItem from '../components/queueItem';

const Room = () => {
    const [playlist, setPlaylist] = useState([]);
    const [roomName, setRoomName] = useState('Room');
    const [isPlaying, setIsPlaying] = useState(false);
    const [searchBar, setSearchBar] = useState('');
    const [query, setQuery] = useState('');
    const [suggestedVideos, setSuggestedVideos] = useState([]);
    const [isEnded, setIsEnded] = useState();
    const [localStorageAPIKey, setLocalStorageAPIKey] = useState();
    const [roomExists, setRoomExists] = useState();
    const playerRef = useRef(null);
    const cachedResults = useMemo(() => new Map(), [])

    useEffect(() => {
        const getSuggestedVideos = async () => {
            if (!query){
                setSuggestedVideos([])
                return
            }

            if (cachedResults.has(query) && cachedResults.get(query)) {
                setSuggestedVideos(cachedResults.get(query));
            } else {
                const data = await fetchSuggestedVideos(query);
                cachedResults.set(query, data);
                setSuggestedVideos(data)
            }
        }

        getSuggestedVideos()
    }, [query, cachedResults])

    useEffect(async () => {
        const roomId = localStorage.getItem("roomID")
        let isValidRoom = false
        const getRooms = async() => {
            const querySnapshot = await getDocs(collection(firestore, "rooms"));
            querySnapshot.forEach((doc) => {
                console.log(roomId, doc.id, (roomId == doc.id))
                if(roomId == doc.id){
                    setRoomExists(true)
                    isValidRoom = true
                    console.log("Room Exists")
                }
            })
        }
        await getRooms();
        if(!isValidRoom){
            setRoomExists(false)
        }
        let apiKey = localStorage.getItem("apiKey");
        if(apiKey){
            setLocalStorageAPIKey(apiKey)
        }
    }, [])

    useEffect(() => {
        if(roomExists == false){
            console.log("Redir")
            window.location.href = "/searchRoom"
        }
    }, [roomExists])

    const playVideo = (event) => {
        console.log("Playing Video")
        event.target.playVideo()
        const iframe = event.target.getIframe();
        iframe.style.width = '100%';
    }

    const playPause = () => {
        if (!isPlaying){
            playerRef.current.internalPlayer.playVideo();
        }else{
            playerRef.current.internalPlayer.pauseVideo();
        }
        
    }

    const skip = () => {
        const duration = playerRef.current.internalPlayer.getDuration();
        playerRef.current.internalPlayer.nextVideo();
    }

    const onPlay = () => {
        console.log("Playing")
        setIsPlaying(true)
        setIsEnded(false)
    }

    const onPause = () => {
        console.log("Pause")
        setIsPlaying(false)
    }

    const onEnd = async (event) => {
        setPlaylist(playlist.slice(1))
        if(playlist[0]){
            event.target.loadVideoById(playlist[0])
        } else {
            setIsEnded(true)
        }
    }

    const addVideo = (videoId) => {
        setPlaylist([...playlist, videoId])
        
    }

    const fetchSuggestedVideos = async (search) => {
        const apiKey = 'AIzaSyAFQpD74U03NWIFoGd6i9nLLgX9-LUgyF4'
        const response = await fetch(`
            https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=${localStorageAPIKey ? localStorageAPIKey : apiKey}
        `)
        const data = await response.json();
        return data.items;
    }

    const handleSearchChange = (event) => {
        event.preventDefault()
        setQuery(searchBar);
        console.log(suggestedVideos)
    }

    const onSearchClick = (event) => {
        const videoId = event.currentTarget.id
        addVideo(videoId)
        setQuery('')
        setSearchBar('')
    }

    const leaveRoomHandler = () => {
        localStorage.removeItem("roomID")
        window.location.reload()
    }

    const opts = {
        playerVars: {
            autoplay: 1,
          }
    }

    return ( 
    <Layout>
        <h1>{roomName}</h1>
        {playlist[0] && <div className="video-player" style={{width:"100%"}}>
            <YouTube 
            videoId={playlist[0]}
            opts={opts} 
            onReady={playVideo} 
            onPlay={onPlay}
            onPause={onPause}
            onEnd={onEnd}
            ref={playerRef}
            />
            <div className="controls">
                <div className="play-pause" onClick={playPause}>
                    Play/Pause
                </div>
                <div className="skip" onClick={skip}>
                    Skip
                </div>
            </div>
        </div>}
        
         <h3>Now Playing</h3>
         <div className='queue' style={{display: 'grid'}}>
            
            {
                playlist.map((video, index) => {
                    return(
                        <>
                            <QueueItem videoID={video} key={localStorageAPIKey}/>
                            {index == 0 && <h4>Up Next</h4>}
                        </>
                        
                    )
                }) 
            }
         </div>
         <div className="search">
            <form onSubmit={handleSearchChange}>
                <input type='text' placeholder='Search for videos' id='searchBar' value={searchBar} onChange={() => setSearchBar(event.target.value)} autoComplete='none'/>
                <button type='submit'>Search</button>
            </form>
            
            <ul style={{listStyleType: 'none'}}>
                {suggestedVideos && suggestedVideos[0] && suggestedVideos.map((item, index) => {
                    return(
                    <li key={"suggested-" + index} onClick={onSearchClick} id={item.id.videoId} style={{display: 'flex'}}>
                        <img src={item.snippet.thumbnails.default.url}/>
                        {item.snippet.title}
                    </li>)
                })}
            </ul>
        </div>
        <button style={{backgroundColor: "red"}} onClick={leaveRoomHandler}>Leave Room</button>
    </Layout> );
}
 
export default Room;