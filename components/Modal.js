import React from "react";

const Modal = ({ isOpen, onClose, createRoom, setNewRoomName }) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="modal"
			style={{
				position: "fixed",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				backgroundColor: "#333",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				className="modal-content"
				style={{
					backgroundColor: "white",
					padding: "1em",
					width: "60%",
					height: "50%",
				}}
			>
				<div className="modal-header">
					<h3>Create New Room</h3>
				</div>
				<form onSubmit={createRoom} style={{ display: "block" }}>
					<div className="roomNameGroup">
						<label>Room Name</label>
						<input
							type="text"
							placeholder="Room Name"
							onChange={(e) => setNewRoomName(e.target.value)}
							style={{ width: "100%" }}
						></input>
					</div>

					<button type="submit">Submit</button>
				</form>
				<button
					className="modal-close"
					onClick={onClose}
					style={{ marginTop: "0.5em" }}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default Modal;
