import UserContextProvider from "../contexts/userContext";
import Header from "./header";

const Layout = ({ children }) => {
    return ( 
        <UserContextProvider>
             <div className="content">
                <Header></Header>
                {children}
            </div>
        </UserContextProvider>
     );
}
 
export default Layout;