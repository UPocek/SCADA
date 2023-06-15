import styles from "../styles/Login.module.css"
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [credentialsNotValid, setCredentialsNotValid] = useState();

    const handleSubmit = (event) => {
        event.preventDefault();
        const username = event.currentTarget.username.value;
        const password = event.currentTarget.password.value;
        if (username == '' || password == '') {
            alert("You didn't fill out the form properly. Try again.");
        } else {
            login({ username: username, password: password }, router, setCredentialsNotValid)
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
    const user = new CognitoUser({
        Username: credentials['username'],
        Pool: UserPool
    });
    const authDetails = new AuthenticationDetails({
        Username: credentials['username'],
        Password: credentials['password']
    });

    user.authenticateUser(authDetails, {
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken.jwtToken);
            localStorage.setItem('idToken', data.idToken.jwtToken);
            localStorage.setItem('refreshToken', data.refreshToken.token);
            router.replace('/');
        },
        onFailure: (err) => {
            console.log(err);
            setCredentialsNotValid(true);
        },
        newPasswordRequired: (data) => {
            console.log(data);
            router.replace('/reset-password');
        }
    });
}