import Link from 'next/link';

const Header = () => {
    return ( 
    <header style={{padding: '0.5em', borderBottom: "1px solid black"}}>
        <nav style={{display: 'flex', justifyContent: 'space-around'}}>
          <Link href="/">Home</Link>
          <Link href="/roomPage">Room</Link>
          <Link href="/profile">Profile</Link>
        </nav>
      </header> 
      );
}
 
export default Header;