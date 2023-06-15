import Link from 'next/link';
import navStyle from '../styles/Navbar.module.css'

import Router from 'next/router';

export default function NavBar() {
    function logOut() {
        signOut();
        clearAuthTokens();
        localStorage.clear();
        Router.push("/login");
    }

    const menuItems = ['Control Panel', 'Monitoring'];

    return (
        <nav className={navStyle.navbarStyle}>
            {/* <Link href='/'>
                <Image src="/../public/images/ws_logo.png" width={330} height={90} alt='WebSecurity Logo' />
            </Link> */}
            <ul className={navStyle.navUl}>
                {menuItems.map(item => <li key={item}><Link href={`/${item != 'Home' ? item.toLowerCase() : ''}`} className={navStyle.navItem}>{item}</Link></li>)}
            </ul>
            <ul className={navStyle.navUl}>
                <Link className={navStyle.signOut} href="/" onClick={logOut}>Sign out</Link>
            </ul>
        </nav>
    );
}