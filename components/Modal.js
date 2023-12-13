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
					boxSizing: "border-box",
				}}
			>
				<div className="modal-header" style={{ display: "flex" }}>
					<h3 style={{ width: "100%" }}>Create New Room</h3>
					<div
						className="modal-close"
						onClick={onClose}
						style={{
							marginTop: "0.5em",
							width: "10%",
							height: "10%",
							textAlign: "center",
							justifyContent: "center",
						}}
					>
						Close
					</div>
				</div>

				<form
					onSubmit={createRoom}
					style={{ display: "flex", flexDirection: "column", height: "80%" }}
				>
					<div className="roomNameGroup">
						<label>Room Name</label>
						<input
							type="text"
							placeholder="Room Name"
							onChange={(e) => setNewRoomName(e.target.value)}
							style={{
								width: "100%",
								padding: "10px 15px",
								boxSizing: "border-box",
								marginBlock: "1em",
							}}
						></input>
					</div>
					<div
						className="submit-button"
						style={{
							marginTop: "auto",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<button
							type="submit"
							style={{
								padding: "1em ",
								backgroundColor: "lime",
								color: "black",
								fontWeight: "bold",
								borderRadius: "1em",
							}}
						>
							Create Room
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Modal;
