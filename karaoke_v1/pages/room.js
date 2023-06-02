import Link from 'next/link'
import { useRef, useState } from 'react';
import YouTube from 'react-youtube'
import Layout from '../components/layout';
import QueueItem from '../components/queueItem';

const Room = () => {
    const [playlist, setPlaylist] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnded, setIsEnded] = useState();
    const playerRef = useRef(null);
    const videoIDs = ['RkjSfZ30GM4', 'JbknEqLpgtA', 'Ptk_1Dc2iPY']

    const playVideo = (event) => {
        console.log("Playing Video")
        event.target.playVideo()
        console.log("Iframe")
        const iframe = event.target.getIframe();
        iframe.style.width = '100%';
    }

    const onEnd = (event) => {
        playlist.shift()
        if(playlist[0]){
            event.target.playVideo()
        } else {
            setIsEnded(true)
        }
        
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

    const addVideo = () => {
        let videoId = videoIDs[Math.floor(Math.random() * 3)]
        setPlaylist([...playlist, videoId])
    }

    const opts = {
        playerVars: {
            autoplay: 1,
          }
    }

    return ( 
    <Layout>
        <h1>Room</h1>
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
        
         <h3>Up Next</h3>
         <div className='queue' style={{display: 'grid'}}>
            
            {
                playlist.map((video) => {
                    console.log(video)
                    return(<QueueItem
                        videoID={video}
                    />)
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