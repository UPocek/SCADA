import { useEffect, useState } from "react"
import styles from "../styles/RTU.module.css"
import axios from "axios"
import { baseUrl } from "./_app"

export default function RTUPage() {
    const [RTUs, setRTUs] = useState({});

    useEffect(() => {
        let tags = [];
        axios.get(`${baseUrl}/Tags/analog`).then(response => { tags.push(...response.data); unpackTags(tags); }).catch(err => console.log("Error on analog addresses"));
        axios.get(`${baseUrl}/Tags/digital`).then(response => { tags.push(...response.data); unpackTags(tags); }).catch(err => console.log("Error on digital addresses"));
    }, []
    )

    function unpackTags(data) {
        const rtus = {};

        for (let tag of data) {
            if (!Object.keys(rtus).includes(tag['rtuId'])) {
                rtus[tag['rtuId']] = [];
            }
            rtus[tag['rtuId']].push(tag);
        }
        setRTUs(rtus);
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
    const [isOn, setIsOn] = useState(tag['onOffScan']);
    const [job, setJob] = useState(null);
    const urlForUpdate = tag['highLimit'] ? `${baseUrl}/Tags/analog/${tag['address']}` : `${baseUrl}/Tags/digital/${tag['address']}`
    const urlToSwitch = tag['highLimit'] ? `${baseUrl}/Tags/analog/turnSwitch/${tag['address']}` : `${baseUrl}/Tags/digital/turnSwitch/${tag['address']}`
    const getRandomValue = tag['highLimit'] ? getRandomAnalog : getRandomDigital;

    useEffect(() => {
        if (isOn) {
            const intervalId = setInterval(() => {
                const signal = getRandomValue()
                axios.put(urlForUpdate, null, {
                    params: {
                        value: signal,
                    }
                })
                console.log(signal)
            }, tag['scanTime'])

            return () => { clearInterval(intervalId); }
        }
    }, [isOn])


    function getRandomDigital() {
        return Math.floor(Math.random() * 2);
    }

    function getRandomAnalog() {
        return (Math.random() * (tag['highLimit'] - tag['lowLimit']) + tag['lowLimit']).toFixed(2);
    }

    function TurnOnTag() {
        if (!isOn) {
            axios.put(urlToSwitch, null)
            setIsOn(true);
            // const newIntervalId = setInterval(() => {
            //     const signal = getRandomValue()
            //     axios.put(urlForUpdate, null, {
            //         params: {
            //             value: signal,
            //         }
            //     })
            //     console.log(signal)
            // }, tag['scanTime'])
            // setJob(newIntervalId)
        }
    }

    function TurnOffTag() {
        if (isOn) {
            axios.put(urlToSwitch, null)
            setIsOn(false);
            // clearInterval(job);
        }
    }

    return <div >
        <p className={styles.meterName}>{tag['name']}</p>
        <div className={styles.metering}>
            <div className={`${styles.signal} ${isOn ? styles.onSignal : styles.offSignal}`}></div>
            <div className={styles.IObtns}>
                <div className={`${styles.onBtn} ${isOn ? styles.black : ''}`} onClick={TurnOnTag}>On</div>
                <div className={`${styles.offBtn} ${isOn ? '' : styles.black}`} onClick={TurnOffTag}>Off</div>
            </div>
        </div>
    </div>
}