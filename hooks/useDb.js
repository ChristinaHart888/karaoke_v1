import { firestore } from "../components/firestore"
import { doc, getDoc, updateDoc } from "firebase/firestore"

const useDb = () => {
    const addMember = async (userID, roomID, collectionName = 'rooms') => {
        const docReference = doc(firestore, collectionName, roomID)
        const docSnapshot = await getDoc(docReference)
        console.log(docSnapshot)
        const currentMembers = docSnapshot.data().members

        if (Array.isArray(currentMembers) && !currentMembers.includes(userID)){
            const newMembers = [...currentMembers, userID]
            await updateDoc(docReference, { members: newMembers})
        }
    }

    const removeMember = async (userID, roomID, collectionName = 'rooms') => {
        const docReference = doc(firestore, collectionName, roomID)
        const docSnapshot = await getDoc(docReference)
        console.log(docSnapshot)
        const currentMembers = docSnapshot.data().members

        if (Array.isArray(currentMembers) && currentMembers.includes(userID)){
            const newMembers = currentMembers.filter(uID => uID != userID)
            await updateDoc(docReference, { members: newMembers})
        }
    }

    const addToQueue = async (videoID, roomID, collectionName = 'rooms') => {
        const docReference = doc(firestore, collectionName, roomID)
        const docSnapshot = await getDoc(docReference)
        const currentQueue = docSnapshot.data().queue

        if (Array.isArray(currentQueue)){
            const newQueue = [...currentQueue, videoID]
            await updateDoc(docReference, { queue: newQueue})
        }
    }

    const removeFromQueue = async (index, roomID, collectionName = 'rooms') => {
        const docReference = doc(firestore, collectionName, roomID)
        const docSnapshot = await getDoc(docReference)
        const currentQueue = docSnapshot.data().queue

        if (Array.isArray(currentQueue) && currentQueue.length > index){
            currentQueue.splice(index, 1)
            await updateDoc(docReference, { queue: currentQueue})
        }
    }

    return {
        addMember,
        removeMember,
        addToQueue,
        removeFromQueue
    }
}
export default useDb