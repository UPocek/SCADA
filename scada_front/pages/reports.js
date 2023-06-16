import NavBar from "@/components/navbar";
import styles from '../styles/Reports.module.css'
import { useEffect, useState } from "react";
import Link from "next/link";
import { baseUrl } from "./_app";
import axios from "axios";
import { getUser } from "@/helper/helper";
export default function Reports() {
    const [selectedReport, setSelectedReport] = useState('All alarms')

    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <SideMenu selectedReport={selectedReport} setSelectedReport={setSelectedReport} />
                {selectedReport == 'All alarms' && <AllAlarmsReport />}
                {selectedReport == 'Alarms with priority' && <PriorityAlarmsReport />}
                {selectedReport == 'All tag values' && <AllTagReport />}
                {selectedReport == 'Last analog tag values' && <AnalogTagReport />}
                {selectedReport == 'Last digital tag values' && <DigitalTagReport />}
                {selectedReport == 'Specific tag values' && <SpecificTagReport />}
            </div>
        </>
    )
}

function SideMenu({ selectedReport, setSelectedReport }) {

    return <div className={styles.sideBar}>
        <div className={`${styles.option} ${selectedReport == 'All alarms' ? styles.selected : ''}`} onClick={() => setSelectedReport('All alarms')}>All alarms</div>
        <div className={`${styles.option} ${selectedReport == 'Alarms with priority' ? styles.selected : ''}`} onClick={() => setSelectedReport('Alarms with priority')}>Alarms with priority</div>
        <div className={`${styles.option} ${selectedReport == 'All tag values' ? styles.selected : ''}`} onClick={() => setSelectedReport('All tag values')}>All tag values</div>
        <div className={`${styles.option} ${selectedReport == 'Last analog tag values' ? styles.selected : ''}`} onClick={() => setSelectedReport('Last analog tag values')}>Last analog tag values</div>
        <div className={`${styles.option} ${selectedReport == 'Last digital tag values' ? styles.selected : ''}`} onClick={() => setSelectedReport('Last digital tag values')}>Last digital tag values</div>
        <div className={`${styles.option} ${selectedReport == 'Specific tag values' ? styles.selected : ''}`} onClick={() => setSelectedReport('Specific tag values')}>Specific tag values</div>
    </div>
}

function AllAlarmsReport() {
    const [fromDate, setFrom] = useState(new Date().toJSON().slice(0, 10))
    const [toDate, setTo] = useState(new Date().toJSON().slice(0, 10))
    const [alarms, setAlarms] = useState([])

    function getAlarms() {
        axios.get(`${baseUrl}/Reports/allAlarmsByDate`, { params: { 'from': fromDate, 'to': toDate } }).then(response => sortAlarms(response.data)).catch(err => console.log(err, " error get all alarm reports"))
    }

    function sortAlarms(data) {
        data.sort((alarm1, alarm2) => {
            let priority1 = alarm1['priority'].toLowerCase(),
                priority2 = alarm2['priority'].toLowerCase();

            if (priority1 < priority2) {
                return -1;
            }
            if (priority1 > priority2) {
                return 1;
            }
            return 0;
        });

        data.sort((alarm1, alarm2) => {
            let time1 = alarm1['date'].toLowerCase(),
                time2 = alarm2['date'].toLowerCase();

            if (time1 < time2) {
                return -1;
            }
            if (time1 > time2) {
                return 1;
            }
            return 0;
        });

        setAlarms(data)
    }

    return <div className={styles.report}>
        <div className={styles.dates}>
            <input type="date" placeholder="from" value={fromDate} onChange={e => setFrom(e.target.value.toString())} />
            <input type="date" placeholder="from" value={toDate} onChange={e => setTo(e.target.value.toString())} />
            <button className={styles.getBtn} onClick={getAlarms}>Get</button>
        </div>
        <table className={styles.main_table}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Date</th>
                    <th>Direction</th>
                    <th>Value</th>
                    <th>Priority</th>
                    <th>Tag id</th>
                    <th>IO Address</th>
                    <th>Units</th>
                </tr>
            </thead>
            <tbody>
                {alarms.map(alarm => <AlarmRecord key={alarm['id']} alarm={alarm} />)}
            </tbody>
        </table>
    </div>
}

function PriorityAlarmsReport() {
    const [priority, setPriority] = useState('1')
    const [alarms, setAlarms] = useState([])
    function getAlarms() {
        axios.get(`${baseUrl}/Reports/allAlarmsByPriority`, { params: { 'priority': priority } }).then(response => sortAlarms(response.data)).catch(err => console.log(err, " error get priority alarm reports"))
    }

    function sortAlarms(data) {
        data.sort((alarm1, alarm2) => {
            let time1 = alarm1['date'].toLowerCase(),
                time2 = alarm2['date'].toLowerCase();

            if (time1 < time2) {
                return -1;
            }
            if (time1 > time2) {
                return 1;
            }
            return 0;
        });

        setAlarms(data)
    }

    return <div className={styles.report}>
        <div className={styles.dates}>
            <select name="priority" id="priority" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value='1'>LOW</option>
                <option value='2'>MEDIUM</option>
                <option value='3'>HIGH</option>
            </select>
            <button className={styles.getBtn} onClick={getAlarms}>Get</button>
        </div>
        <table className={styles.main_table}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Date</th>
                    <th>Direction</th>
                    <th>Value</th>
                    <th>Priority</th>
                    <th>Tag id</th>
                    <th>IO Address</th>
                    <th>Units</th>
                </tr>
            </thead>
            <tbody>
                {alarms.map(alarm => <AlarmRecord key={alarm['id']} alarm={alarm} />)}
            </tbody>
        </table>
    </div>
}

function AlarmRecord({ alarm }) {
    return <tr>
        <td>{alarm['id']}</td>
        <td>{alarm['date'].split('T')[0]}</td>
        <td>{alarm['value']}</td>
        <td>{alarm['priority']}</td>
        <td>{alarm['tagId']}</td>
        <td>{alarm['direction']}</td>
        <td>{alarm['address']}</td>
        <td>{alarm['units']}</td>
    </tr>
}


function AllTagReport() {
    const [from, setFrom] = useState(new Date().toJSON().slice(0, 10))
    const [to, setTo] = useState(new Date().toJSON().slice(0, 10))
    const [tags, setTags] = useState([])

    function getTags() {
        axios.get(`${baseUrl}/Reports/allHistoryValues`, { params: { 'from': from, 'to': to } }).then(response => sortTags(response.data)).catch(err => console.log(err, " error get all tags reports"))
    }

    function sortTags(data) {
        data.sort((tag1, tag2) => {
            let time1 = tag1['date'].toLowerCase(),
                time2 = tag2['date'].toLowerCase();

            if (time1 < time2) {
                return -1;
            }
            if (time1 > time2) {
                return 1;
            }
            return 0;
        });

        setTags(data)
    }

    return <div className={styles.report}>
        <div className={styles.dates}>
            <input type="date" placeholder="from" value={from} onChange={e => setFrom(e.target.value.toString())} />
            <input type="date" placeholder="to" value={to} onChange={e => setTo(e.target.value.toString())} />
            <button className={styles.getBtn} onClick={getTags}>Get</button>
        </div>
        <table className={styles.main_table}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>IO Address</th>
                    <th>Value</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {tags.map(tag => <AllTagRecord key={tag['id']} tag={tag} />)}
            </tbody>
        </table>
    </div>
}

function AnalogTagReport() {
    const [tags, setTags] = useState([])

    useEffect(() => {
        getTags()
    }, [])

    function getTags() {
        axios.get(`${baseUrl}/Reports/allAnalogValues`).then(response => sortTags(response.data)).catch(err => console.log(err, " error get analog tags reports"))
    }

    function sortTags(data) {
        if (data.length > 0) {
            data.sort((tag1, tag2) => {
                let time1 = tag1['scanTime'],
                    time2 = tag2['date'];

                if (time1 < time2) {
                    return -1;
                }
                if (time1 > time2) {
                    return 1;
                }
                return 0;
            });

            setTags(data)
        }

    }

    return <div className={styles.report}>
        <table className={styles.main_table}>
            <thead>
                <tr>
                    <th>Address</th>
                    <th>Value</th>
                    <th>Low limit</th>
                    <th>High limit</th>
                    <th>Units</th>
                    <th>Scan time</th>
                    <th>RTU id</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {tags.map(tag => <AnalogTagRecord key={tag['address']} tag={tag} />)}
            </tbody>
        </table>
    </div>
}

function DigitalTagReport() {
    const [tags, setTags] = useState([])

    useEffect(() => {
        getTags()
    }, [])

    function getTags() {
        axios.get(`${baseUrl}/Reports/allDigitalValues`).then(response => sortTags(response.data)).catch(err => console.log(err, " error get analog tags reports"))
    }

    function sortTags(data) {
        if (data.length > 0) {
            data.sort((tag1, tag2) => {
                let time1 = tag1['scanTime'],
                    time2 = tag2['scanTime'];

                if (time1 < time2) {
                    return -1;
                }
                if (time1 > time2) {
                    return 1;
                }
                return 0;
            });

            setTags(data)
        }
    }

    return <div className={styles.report}>
        <table className={styles.main_table}>
            <thead>
                <tr>
                    <th>IO Address</th>
                    <th>Value</th>
                    <th>Scan time</th>
                    <th>RTU id</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {tags.map(tag => <DigitalTagRecord key={tag['address']} tag={tag} />)}
            </tbody>
        </table>
    </div>
}

function SpecificTagReport() {
    const [tagId, setTagId] = useState(-1)
    const [tags, setTags] = useState([])
    const [tagIds, setTagIds] = useState([])

    useEffect(() => {
        let user = getUser()
        if (user != undefined) {
            let userTags = []
            userTags.push(...user['analogInputs'])
            userTags.push(...user['digitalInputs'])
            setTagIds(userTags.map(tag => tag['id']))
        }
    }, [])

    function getTags() {
        if (tagId != -1) {
            axios.get(`${baseUrl}/Reports/allTagValues`, { params: { 'tagId': tagId } }).then(response => sortTags(response.data)).catch(err => console.log(err, " error get analog tags reports"))
        }
    }

    function sortTags(data) {
        data.sort((tag1, tag2) => {
            let value1 = tag1['value'].toLowerCase(),
                value2 = tag2['value'].toLowerCase();

            if (value1 < value2) {
                return -1;
            }
            if (value1 > value2) {
                return 1;
            }
            return 0;
        });

        setTags(data)
    }

    return <div className={styles.report}>
        <div className={styles.dates}>
            <select name="tadId" id="tadId" value={tagId} onChange={e => setTagId(e.target.value)}>
                {tagIds.map(id => <option key={id} value={id}>{id}</option>)}
            </select>
            <button className={styles.getBtn} onClick={getTags}>Get</button>
        </div>
        <table className={styles.main_table}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Tag id</th>
                    <th>Description</th>
                    <th>Value</th>
                    <th>Units</th>
                    <th>IO Address</th>
                </tr>
            </thead>
            <tbody>
                {tags.map(tag => <SpecificTagRecord key={tag['address']} tag={tag} />)}
            </tbody>
        </table>
    </div>
}

function AllTagRecord({ tag }) {
    return <tr>
        <td>{tag['id']}</td>
        <td>{tag['address']}</td>
        <td>{tag['value']}</td>
        <td>{tag['date']}</td>
    </tr>
}

function AnalogTagRecord({ tag }) {
    return <tr>
        <td>{tag['address']}</td>
        <td>{tag['value']}</td>
        <td>{tag['lowLimit']}</td>
        <td>{tag['highLimit']}</td>
        <td>{tag['units']}</td>
        <td>{tag['scanTime']}</td>
        <td>{tag['rtuId']}</td>
        <td>{tag['name']}</td>
    </tr>
}

function DigitalTagRecord({ tag }) {
    return <tr>
        <td>{tag['address']}</td>
        <td>{tag['value']}</td>
        <td>{tag['scanTime']}</td>
        <td>{tag['rtuId']}</td>
        <td>{tag['name']}</td>
    </tr>
}

function SpecificTagRecord({ tag }) {
    return <tr>
        <td>{tag['id']}</td>
        <td>{tag['tagId']}</td>
        <td>{tag['description']}</td>
        <td>{tag['value']}</td>
        <td>{tag['units']}</td>
        <td>{tag['address']}</td>
    </tr>
}

function TagRecord({ tag }) {
    return <tr>
        <td>id</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
    </tr>
}