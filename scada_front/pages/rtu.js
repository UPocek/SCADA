import { useEffect, useState } from "react"
import styles from "../styles/RTU.module.css"
import axios from "axios"
import { baseUrl } from "./_app"

export default function RTUPage() {
    const [RTUs, setRTUs] = useState({})

    useEffect(() => {
        let tags = []
        axios.get(`${baseUrl}/Tags/analog`).then(response => tags.push(...response.data)).catch(err => console.log("Greska pri dobavljanju analognih tagova"))
        axios.get(`${baseUrl}/Tags/digital`).then(response => { tags.push(...response.data); unpackTags(tags) }).catch(err => console.log("Greska pri dobavljanju digitalnih tagova"))
    }, []
    )

    function unpackTags(data) {
        const rtus = {}

        for (let tag of data) {
            if (!Object.keys(rtus).includes(tag['rtuId'])) {
                rtus[tag['rtuId']] = []
            }
            rtus[tag['rtuId']].push(tag)
        }
        console.log(rtus)

        setRTUs(rtus)
    }

    return <div className={styles.mainContainer}>
        <h1>Remote terminal units</h1>
        <div className={styles.rtuContainer}>
            {Object.keys(RTUs).map(key => <RTU key={key} name={key} tags={RTUs[key]} />)}
        </div>
    </div>
}

function RTU({ name, tags }) {
    return <div className={styles.rtuWrapper}>
        <h3>Rtu {name}</h3>
        <div className={styles.rtu}>
            {tags.map(tag => <Metering tag={tag} key={tag['address']} />)}
        </div>
    </div>
}

function Metering({ tag }) {
    const [isOn, setIsOn] = useState(false)

    return <div >
        <p className={styles.meterName}>{tag['name']}</p>
        <div className={styles.metering}>
            <div className={`${styles.signal} ${isOn ? styles.onSignal : styles.offSignal}`}></div>
            <div className={styles.IObtns}>
                <div className={`${styles.onBtn} ${isOn ? styles.black : ''}`} onClick={() => setIsOn(true)}>On</div>
                <div className={`${styles.offBtn} ${isOn ? '' : styles.black}`} onClick={() => setIsOn(false)}>Off</div>
            </div>
        </div>
    </div>
}