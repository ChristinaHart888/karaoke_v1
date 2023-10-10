import { firestore } from "../components/firestore";
import {
	collection,
	doc,
	getDoc,
	updateDoc,
	getDocs,
	query,
	where,
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

	const pushSong = async ({ roomID, index, collectionName = "rooms" }) => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		const currentQueue = docSnapshot.data().queue;

		if (
			Array.isArray(currentQueue) &&
			index >= 0 &&
			currentQueue.length > index
		) {
			const song = currentQueue.splice(index, 1)[0];
			currentQueue.splice(1, 0, song);
			console.log("useDB pushed");
			await updateDoc(docReference, { queue: currentQueue });
		} else {
			console.log("useDB failed to push");
			console.log("index:", index, index >= 0);
			console.log(
				"currentQueue:",
				currentQueue.length,
				currentQueue.length > index
			);
		}
	};

	const removeFromQueue = async (index, roomID, collectionName = "rooms") => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		const currentQueue = docSnapshot.data().queue;

		if (Array.isArray(currentQueue) && currentQueue.length > index) {
			currentQueue.splice(index, 1);
			await updateDoc(docReference, { queue: currentQueue });
			return currentQueue;
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

	const getNextMembers = async (roomID, collectionName = "rooms") => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		const members = docSnapshot.data().members;

		if (Array.isArray(members)) {
			const notDoneMembers = members.filter((member) => member.done != true);
			return notDoneMembers;
		}
	};

	const addDoneMember = async (roomID, userID, collectionName = "rooms") => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		const members = docSnapshot.data().members;

		if (Array.isArray(members)) {
			let memberIndex = members.findIndex((member) => member.userID === userID);
			if (memberIndex < 0) {
				console.error("Member with ID ", userID, " does not exist");
			} else {
				members[memberIndex].done = true;
				console.log("Members:", members);
				await updateDoc(docReference, { members: members });
			}
		}
	};

	const clearDoneMember = async (roomID, collectionName = "rooms") => {
		const docReference = doc(firestore, collectionName, roomID);
		const docSnapshot = await getDoc(docReference);
		const members = docSnapshot.data().members;

		if (Array.isArray(members)) {
			console.log("clearing");
			for (let i = 0; i < members.length; i++) {
				members[i].done = false;
			}
			await updateDoc(docReference, { members: members });
			return members;
		}
	};

	return {
		addMember,
		removeMember,
		addToQueue,
		removeFromQueue,
		getRooms,
		getRoomInfo,
		pushSong,
		addDoneMember,
		clearDoneMember,
		getNextMembers,
	};
};
export default useDb;
