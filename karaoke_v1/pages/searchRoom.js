import Layout from "../components/layout";
import { collection, getDocs } from "firebase/firestore"; 
import { firestore } from "../components/firestore";
import { useEffect, useState } from "react";

const SearchRoom = () => {

    const [rooms, setRooms] = useState()

    useEffect(() => {
        const getRooms = async() => {
            const querySnapshot = await getDocs(collection(firestore, "rooms"));
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
            })
            setRooms(querySnapshot.docs)
        }
        getRooms();
    }, [])

    

    return ( 
    <Layout>
        <h1>Search Room</h1>
        <div>
            {rooms && rooms.map((room) => {
                const roomData = room.data();
                const roomName = roomData.roomName
                return(
                    <p>
                        {roomName}
                    </p>
                    
                )
            })}
        </div>
    </Layout> );
}
 
export default SearchRoom;