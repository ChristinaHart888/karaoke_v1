import { firestore } from "../components/firestore";
import {
	collection,
	doc,
	getDoc,
	updateDoc,
	getDocs,
} from "firebase/firestore";

const useDb = () => {
	const addMember = async ({
		userID,
		username,
		roomID,
		collectionName = "rooms",
	}) => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		console.log(docSnapshot);
		const currentMembers = docSnapshot.data().members;

		if (Array.isArray(currentMembers) && !currentMembers.includes(userID)) {
			const newMembers = [...currentMembers, { userID, username }];
			await updateDoc(docReference, { members: newMembers });
		}
	};

	const removeMember = async (userID, roomID, collectionName = "rooms") => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		console.log(docSnapshot);
		const currentMembers = docSnapshot.data().members;

		if (Array.isArray(currentMembers)) {
			const newMembers = currentMembers.filter(
				(member) => member.userID != userID
			);
			await updateDoc(docReference, { members: newMembers });
		}
	};

	const addToQueue = async (
		videoID,
		videoTitle,
		videoThumbnail,
		roomID,
		userID,
		username,
		collectionName = "rooms"
	) => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		const currentQueue = docSnapshot.data().queue;

		if (Array.isArray(currentQueue)) {
			const newQueue = [
				...currentQueue,
				{
					videoID: videoID,
					videoThumbnail: videoThumbnail,
					videoTitle: videoTitle,
					userID,
					username,
				},
			];
			await updateDoc(docReference, { queue: newQueue });
		}
	};

	const removeFromQueue = async (index, roomID, collectionName = "rooms") => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		const currentQueue = docSnapshot.data().queue;

		if (Array.isArray(currentQueue) && currentQueue.length > index) {
			currentQueue.splice(index, 1);
			await updateDoc(docReference, { queue: currentQueue });
		}
	};

	const getRooms = async (setRooms) => {
		try {
			const querySnapshot = await getDocs(collection(firestore, "rooms"));
			setRooms(querySnapshot.docs);
		} catch (e) {
			console.error(e);
		}
	};

	const getRoomInfo = async (roomID, collectionName = "rooms") => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		const roomInfo = docSnapshot.data();
		console.log("re", roomInfo);
		return roomInfo;
	};

	return {
		addMember,
		removeMember,
		addToQueue,
		removeFromQueue,
		getRooms,
		getRoomInfo,
	};
};
export default useDb;
