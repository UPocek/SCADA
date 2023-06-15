import { useRef, useState } from "react"
import styles from "../styles/Registration.module.css"
import { useRouter } from "next/router";

export default function RegistrationPage() {
    const ref = useRef(null);
    const router = useRouter();
    const [formInvalid, setFormInvalide] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const inputs = {
            "name": event.target.name.value,
            "surname": event.target.surname.value,
            "birthday": event.target.birthday.value,
            "username": event.target.email.value,
            "email": event.target.email.value,
            "password": event.target.password.value,
            "invite": event.target.invite.value
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
                <h1>Register on SCADA</h1>
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

    // if (inputs['invite'] != '') {
    //     axios.post('https://r7u7c2n6eh.execute-api.eu-central-1.amazonaws.com/Prod/api/resolveInvitation', { 'username': inputs['email'], 'email': inputs['email'], 'preferred_username': inputs['username'], 'name': inputs['name'], 'custom:surname': inputs['surname'], 'custom:birthday': inputs['birthday'], 'inviter': inputs['invite'] })
    //         .then(response => router.replace('/login'))
    //         .catch(err => router.replace('/login'));
    //     return;
    // }

    // const attributeList = [
    //     new CognitoUserAttribute({ Name: 'preferred_username', Value: inputs['username'] }),
    //     new CognitoUserAttribute({ Name: 'name', Value: inputs['name'] }),
    //     new CognitoUserAttribute({ Name: 'custom:surname', Value: inputs['surname'] }),
    //     new CognitoUserAttribute({ Name: 'custom:birthday', Value: inputs['birthday'] }),
    // ]
    // UserPool.signUp(inputs['email'], inputs['password'], attributeList, null, (err, data) => {
    //     if (err) {
    //         console.log(err)
    //         setFormInvalide(true);
    //     }
    //     if (data) {
    //         router.replace('/login');
    //     }
    // });
}