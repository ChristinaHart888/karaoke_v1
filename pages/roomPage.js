import { useEffect, useState } from "react";
import SearchRoom from "./searchRoom";
import Room from "./room";

const RoomPage = () => {
    const [roomId, setRoomId] = useState('');

    useEffect(() => {
        const roomID = localStorage.getItem("roomID");
        const userID = localStorage.getItem("userID");
        if(!userID){
            window.location.href = './profile'
        }
        setRoomId(roomID)
        console.log("RoomID:", roomID)
    }, [])

    return ( 
       <>
       {roomId ? <Room></Room> : <SearchRoom></SearchRoom>}
       </>
     );
}
 
export default RoomPage;