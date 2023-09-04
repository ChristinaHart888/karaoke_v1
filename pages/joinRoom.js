import Layout from "../components/layout";
import * as signInStyle from "../styles/signin.module.css";

const JoinRoom = () => {
	return (
		<Layout>
			<div className={signInStyle.container}>
				<div className={signInStyle.loginBox}></div>
			</div>
		</Layout>
	);
};

export default JoinRoom;
