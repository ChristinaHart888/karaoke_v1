import { useEffect, useState } from "react";
import SearchRoom from "./searchRoom";
import Room from "./room";

const RoomPage = () => {

    const [roomId, setRoomId] = useState('');

    useEffect(() => {
        const roomID = localStorage.getItem("roomID");
        setRoomId(roomID)
    })

    return ( 
       <>
       {roomId ? <Room></Room> : <SearchRoom></SearchRoom>}
       </>
     );
}
 
export default RoomPage;