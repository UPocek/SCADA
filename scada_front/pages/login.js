import styles from "../styles/Login.module.css"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "./_app";

export default function LoginPage() {
    const router = useRouter();
    const [credentialsNotValid, setCredentialsNotValid] = useState();

    useEffect(() => {
        localStorage.getItem('user') != null && router.replace('/');
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const username = event.currentTarget.username.value;
        const password = event.currentTarget.password.value;
        if (username == '' || password == '') {
            alert("You didn't fill out the form properly. Try again.");
        } else {
            login({ 'username': username, 'password': password }, router, setCredentialsNotValid)
        }
    }
    return <div className={styles.registrationDiv}>
        <form className={styles.registrationForm} onSubmit={handleSubmit}>
            <div className={styles.titleDiv}>
                <h1>Login to SCADA</h1>
                <p>Enter your profile information here.</p>
            </div>

            <div className={styles.inputDiv}>
                <input className={styles.inputField} type="text" id="username" name="username" placeholder="Email" />
            </div>
            <div className={styles.inputDiv}>
                <input className={styles.inputField} type="password" id="password" name="password" placeholder="Password" />
            </div>
            <div className={styles.inputDiv}>
                <div className={styles.submitDiv}>
                    <input className={styles.submitBtn} type="submit" value="Login" />
                </div>
            </div>
            {credentialsNotValid && <p className="err">Credentials not valid. Try again.</p>}
        </form>
    </div>
}

function login(credentials, router, setCredentialsNotValid) {
    axios.post(`${baseUrl}/User/login`, { 'username': credentials['username'], 'password': credentials['password'] })
        .then(response => { localStorage.setItem('user', JSON.stringify(response.data)); router.replace('/') })
        .catch(err => setCredentialsNotValid(true));
}