import Link from 'next/link'
import { useState } from 'react';
import YouTube from 'react-youtube'
import Layout from '../components/layout';

const Room = () => {
    const [currentVideoID, setCurrentVideoID] = useState('RkjSfZ30GM4')

    const playVideo = (event) => {
        console.log("Playing Video")
        event.target.playVideo()
    }

    const setNewVideoID = (event) => {
        //Temp VideoIDs
        const videoIDs = ['RkjSfZ30GM4', 'JbknEqLpgtA', 'Ptk_1Dc2iPY']
        let index = videoIDs.indexOf(currentVideoID)
        if(index + 1 == videoIDs.length){
            index = 0;
        } else {
            index++
        }
        setCurrentVideoID(videoIDs[index])
        event.target.playVideo()
    }

    const opts = {
        playerVars: {
            autoplay: 1,
          }
    }

    return ( 
    <Layout>
        <h1>Room</h1>
        <YouTube 
          videoId={currentVideoID}
          opts={opts} 
          onReady={playVideo} 
          onEnd={setNewVideoID}
         />
    </Layout> );
}
 
export default Room;