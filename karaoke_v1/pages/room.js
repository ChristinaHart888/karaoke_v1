import Link from 'next/link'

const Room = () => {
    return ( 
    <div>
        <h1 style={{fontSize: "170px"}}>Did Ynee Ynee use girl's phone today?</h1>
        <Link style={{fontSize: "100px"}} href="/profile">(a)Yes</Link>
        <option style={{fontSize: "100px"}}>(b)Yes</option>
        <option style={{fontSize: "100px"}}>(c)All of the above</option>
    </div> );
}
 
export default Room;