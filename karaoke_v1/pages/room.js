import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react';
import YouTube from 'react-youtube'
import Layout from '../components/layout';
import QueueItem from '../components/queueItem';

const Room = () => {
    const [playlist, setPlaylist] = useState([]);
    const [roomName, setRoomName] = useState('Room');
    const [isPlaying, setIsPlaying] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestedVideos, setSuggestedVideos] = useState([]);
    const [isEnded, setIsEnded] = useState();
    const playerRef = useRef(null);
    const cachedResults = useMemo(() => new Map(), [])
    const videoIDs = ['RkjSfZ30GM4', 'JbknEqLpgtA', 'Ptk_1Dc2iPY']

    useEffect(() => {
        const getSuggestedVideos = async () => {
            if (!query){
                setSuggestedVideos([])
                return
            }

            if (cachedResults.has(query)) {
                setSuggestedVideos(cachedResults.get(query).slice(0, 5));
            } else {
                const data = await fetchSuggestedVideos(query);
                cachedResults.set(query, data);
                setSuggestedVideos(data)
            }
        }

        getSuggestedVideos()
    }, [query, cachedResults])

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
        const apiKey = 'AIzaSyAvz-aJqhbrqZ0mdbYIwI4emIrpvzjYXgo'
        const response = await fetch(`
            https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=${apiKey}
        `)
        const data = await response.json();
        return data.items;
    }

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        setQuery(searchTerm);
        console.log(suggestedVideos)
    }

    const onSearchClick = (event) => {
        const videoId = event.currentTarget.id
        addVideo(videoId)
        setQuery('')
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
        <div className="search">
            <input type='text' onChange={handleSearchChange} placeholder='Search for videos' value={query}/>
            <ul style={{listStyleType: 'none'}}>
                {suggestedVideos[0] && suggestedVideos.map((item, index) => {
                    return(
                    <li key={"suggested-" + index} onClick={onSearchClick} id={item.id.videoId}>
                        <img src={item.snippet.thumbnails.default.url}/>
                        {item.snippet.title}
                    </li>)
                })}
            </ul>
        </div>
        
         <h3>Now Playing</h3>
         <div className='queue' style={{display: 'grid'}}>
            
            {
                playlist.map((video, index) => {
                    return(
                        <>
                            <QueueItem videoID={video}/>
                            {index == 0 && <h4>Up Next</h4>}
                        </>
                        
                    )
                }) 
            }
         </div>
         <button onClick={addVideo}>
            Add video
         </button>
         <button onClick={() => console.log(playlist)}>
            Check Playlist
         </button>
    </Layout> );
}
 
export default Room;