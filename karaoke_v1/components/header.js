import Link from 'next/link';

const Header = () => {
    return ( 
    <header >
        <nav style={{display: 'flex', justifyContent: 'space-around'}}>
          <Link href="/">Home</Link>
          <Link href="/room">Room</Link>
          <Link href="/profile">Profile</Link>
        </nav>
      </header> 
      );
}
 
export default Header;