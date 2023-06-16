import NavBar from "@/components/navbar";
import styles from '../styles/Reports.module.css'
import { useState } from "react";
export default function Reports() {
    const [selectedReport, setSelectedReport] = useState('All alarms')
    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <SideMenu selectedReport={selectedReport} setSelectedReport={setSelectedReport} />
                <Report />
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

function Report() {
    return <div className={styles.report}>

    </div>
}