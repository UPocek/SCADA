import { useEffect, useState } from "react"
import styles from "../styles/Registration.module.css"
import { useRouter } from "next/router";
import { baseUrl } from "./_app";
import axios from "axios";

export default function RegistrationPage() {
    const router = useRouter();
    const [formInvalid, setFormInvalide] = useState(false);

    useEffect(() => {
        localStorage.getItem('user') == null && router.replace('/login');
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const inputs = {
            "name": event.target.name.value,
            "surname": event.target.surname.value,
            "username": event.target.email.value,
            "password": event.target.password.value
        }

        if (isFormValid(inputs)) {
            registerNewUser(inputs, router, setFormInvalide)
        } else {
            alert("You didn't fill out the form properly. Try again.");
        }

    }
    return <div className={styles.registrationDiv}>
        <form className={styles.registrationForm} onSubmit={handleSubmit}>
            <div className={styles.titleDiv}>
                <h1>Register new user for SCADA</h1>
                <p>Enter your profile information here.</p>
            </div>
            <div className={`${styles.nameDiv} ${styles.inputDiv}`}>
                <div className={styles.innerNameDiv}>
                    <input className={styles.inputField} type="text" id="name" name="name" placeholder="Name"></input>
                </div>
                <div>
                    <input className={styles.inputField} type="text" id="surname" name="surname" placeholder="Surame"></input>
                </div>
            </div>
            <div className={styles.inputDiv}>
                <input className={styles.inputField} type="email" id="email" name="email" placeholder="Email"></input>
            </div>
            <div className={styles.inputDiv}>
                <input className={styles.inputField} type="password" id="password" name="password" placeholder="Password"></input>
            </div>
            <div className={styles.inputDiv}>
                <div className={styles.submitDiv}>
                    <input className={styles.submitBtn} type="submit" value="Register" />
                </div>
            </div>
            {formInvalid && <p className={styles.err}>Email already taken. Try another one.</p>}
        </form>
    </div>
}

function isFormValid(inputs) {
    if (inputs['invite'] == '') return true;
    return !(Object.values(inputs).includes("") || Object.values(inputs).includes(" "))
}

function registerNewUser(inputs, router, setFormInvalide) {
    axios.post(`${baseUrl}/User/registration`, { 'username': inputs['username'], 'password': inputs['password'], 'name': inputs['name'], 'surname': inputs['surname'] })
        .then(response => { alert("New user created."); router.replace('/') })
        .catch(err => setFormInvalide(true));
}