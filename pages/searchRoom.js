import Layout from "../components/layout";
import Modal from '../components/Modal'
import { addDoc, collection, getDocs } from "firebase/firestore"; 
import { firestore } from "../components/firestore";
import { useEffect, useState } from "react";
import Link from 'next/link';
import useDb from "../hooks/useDb";


const SearchRoom = () => {
    const [rooms, setRooms] = useState()
    const [newRoomName, setNewRoomName] = useState("")
    const [modalDisplay, setModalDisplay] = useState(false)

    const { addMember} = useDb()

    useEffect(() => {
        const getRooms = async() => {
            try{
                const querySnapshot = await getDocs(collection(firestore, "rooms"));
                setRooms(querySnapshot.docs)
            }catch (e) {
                console.log(e)
            }
            
        }
        getRooms();
        const roomId = localStorage.getItem("roomID")
        if(roomId){
            window.location.href = './room'
        }
    }, [])

    const selectRoomHandler = async (event) => {
        const roomId = event.currentTarget.id
        const userID = localStorage.getItem('userID')
        await addMember(userID, roomId)
        localStorage.setItem("roomID", roomId)
        window.location.href = './room'
    }

    const createRoom = async (e) => {
        e.preventDefault()
        try {
            console.log("New room name")
            console.log(newRoomName)
            const userID = localStorage.getItem("userID")
            const newRoom = await addDoc(collection(firestore, "rooms"), {
                createdBy: userID,
                roomName: newRoomName,
                members: [userID],
                queue: []
            })
            console.log("New room id: " + newRoom.id)
            localStorage.setItem("roomID", newRoom.id)
        } catch (e){
            console.error(e)
            alert("An error occured when creating room")
        }
        window.location.href = './room'
    }

    const createRoomModalHandler = () => {
        setModalDisplay(true)
    }

    const destroyModalHandler = () => {
        setModalDisplay(false)
    }

    const NewRoomForm = () => {
        return(
            <form onSubmit={createRoom}>
                <label>Room Name</label>
                <input type="text" placeholder="Room Name" onChange={(e) => setNewRoomName(e.target.value)} value={newRoomName}></input>
                <button type="submit">Submit</button>
            </form>
        )
    }

    return ( 
    <Layout>
        <h1>Search Room</h1>
        <Modal 
            isOpen={modalDisplay} 
            onClose={destroyModalHandler}
            createRoom={createRoom}
            setNewRoomName={setNewRoomName}>
        </Modal>
        <div className="roomList" style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
            {rooms && rooms.map((room) => {
                const roomData = room.data();
                const roomName = roomData.roomName
                return(
                    <div id={room.id} key={room.id} onClick={selectRoomHandler} style={{backgroundColor: "white", margin: '1em', border: '1px solid black', width: 'auto'}}>
                        {roomName}
                    </div>
                )
            })}
        </div>
        <button onClick={createRoomModalHandler}>Create Room</button>
    </Layout> );
}
 
export default SearchRoom;