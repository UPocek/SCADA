import styles from "../styles/RTU.module.css"

export default function RTUPage() {
    return <div className={styles.mainContainer}>
        <h1>Remote terminal units</h1>
        <div className={styles.rtuContainer}>
            <RTU />
            <RTU />
            <RTU />
            <RTU />
            <RTU />
            <RTU />
            <RTU />
            <RTU />
            <RTU />
        </div>
    </div>
}

function RTU() {
    return <div className={styles.rtuWrapper}>
        <h3>Rtu name</h3>
        <div className={styles.rtu}>
            <Metering />
            <Metering />
            <Metering />
            <Metering />
        </div>
    </div>
}

function Metering() {
    return <div >
        <p className={styles.meterName}>Temperature</p>
        <div className={styles.metering}>
            <div className={styles.signal}></div>
            <div className={styles.IObtns}>
                <div className={styles.onBtn}>On</div>
                <div className={styles.offBtn}>Off</div>
            </div>
        </div>
    </div>
}