import Link from 'next/link';
import navStyle from '../styles/Navbar.module.css'
import Image from 'next/image';

import Router from 'next/router';
import axios from 'axios';
import { baseUrl } from '@/pages/_app';

export default function NavBar() {
    function logOut() {
        const userString = localStorage.getItem('user');
        userString && notifyServer(JSON.parse(userString)['id']);
        localStorage.clear();
        Router.replace("/login");
    }

    function notifyServer(userId) {
        axios.put(`${baseUrl}/User/logout?userId=${userId}`).then(response => console.log("Log out")).catch(err => console.log("Log out failed"));
    }

    const menuItems = ['Control Panel', 'Monitoring'];

    return (
        <nav className={navStyle.navbarStyle}>
            <Link href='/'>
                <Image src="/images/logo.png" width={190} height={60} alt='WebSecurity Logo' />
            </Link>
            <ul className={navStyle.navUl}>
                {menuItems.map(item => <li key={item}><Link href={`/${item != 'Home' ? item.toLowerCase() : ''}`} className={navStyle.navItem}>{item}</Link></li>)}
            </ul>
            <ul className={navStyle.navUl}>
                <Link className={navStyle.signOut} href="/" onClick={logOut}>Sign out</Link>
            </ul>
        </nav>
    );
}