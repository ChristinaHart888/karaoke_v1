import Link from 'next/link';

const Header = () => {
    return ( 
    <header style={{padding: '5px', height: '25px'}}>
        <nav style={{display: 'flex', justifyContent: 'space-around'}}>
          <Link href="/">Home</Link>
          <Link href="/roomPage">Room</Link>
          <Link href="/profile">Profile</Link>
        </nav>
      </header> 
      );
}
 
export default Header;