import Link from 'next/link';
import navStyle from '../styles/Navbar.module.css'
import Image from 'next/image';
import Router from 'next/router';
import axios from 'axios';
import { baseUrl } from '@/pages/_app';
import { useEffect, useState } from 'react';
import { getIsAdmin } from '@/helper/helper';

export default function NavBar() {
    const [role, setRole] = useState(false);

    useEffect(() => {
        setRole(getIsAdmin());
    }, [])


    function logOut() {
        const userString = localStorage.getItem('user');
        userString && notifyServer(JSON.parse(userString)['id']);
        localStorage.clear();
    }

    function notifyServer(userId) {
        axios.put(`${baseUrl}/User/logout?userId=${userId}`).then(response => Router.replace("/login")).catch(err => console.log(err));
    }

    const menuItems = ['Control Panel', 'Reports'];

    return (
        <nav className={navStyle.navbarStyle}>
            <Link href='/'>
                <Image src="/images/logo.png" width={190} height={60} alt='WebSecurity Logo' />
            </Link>
            <ul className={navStyle.navUl}>
                <li><Link className={navStyle.navItem} href="/" >Control Panel</Link></li>
                {role && <li><Link className={navStyle.navItem} href="/reports">Reports</Link></li>}
                {role && <li><Link className={navStyle.navItem} href="/registration">Create account</Link></li>}
            </ul>
            <ul className={navStyle.navUl}>
                <Link className={navStyle.signOut} href="/" onClick={logOut}>Sign out</Link>
            </ul>
        </nav>
    );
}