import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import NavBar from '@/components/navbar'
import { useEffect, useState } from 'react'
import { getUser, getUserId } from '@/helper/helper'
import axios from 'axios'
import { baseUrl } from './_app'
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();
  const [connectionTags, setConnectionTags] = useState(null);
  const [connectionAlarms, setConnectionAlarms] = useState(null);
  const [user, setUser] = useState({});
  const [tags, setTags] = useState([]);
  const [availableAnalogAddresses, setAvailableAnalogAddresses] = useState([]);
  const [availableDigitalAddresses, setAvailableDigitalAddresses] = useState([]);
  const [activeAlarms, setActiveAlarms] = useState([]);

  useEffect(() => {
    let user = getUser()
    if (user != undefined) {
      setUser(user)
      let userTags = []
      userTags.push(...user['analogInputs'])
      userTags.push(...user['digitalInputs'])
      setTags(userTags)

      axios.get(`${baseUrl}/Tags/analog`).then(response => setAvailableAddresses(response.data, userTags, setAvailableAnalogAddresses)).catch(err => console.log(err, "Error on analog addresses"))
      axios.get(`${baseUrl}/Tags/digital`).then(response => setAvailableAddresses(response.data, userTags, setAvailableDigitalAddresses)).catch(err => console.log("Error on digital addresses"))
    }

  }, [])

  useEffect(() => {
    localStorage.getItem('user') == null && router.replace('/login');
    const newConnectionTags = new HubConnectionBuilder()
      .withUrl('https://localhost:7214/hubs/tags')
      .withAutomaticReconnect()
      .build();
    const newConnectionAlarms = new HubConnectionBuilder()
      .withUrl('https://localhost:7214/hubs/alarms')
      .withAutomaticReconnect()
      .build();

    setConnectionTags(newConnectionTags);
    setConnectionAlarms(newConnectionAlarms);
  }, []);

  useEffect(() => {
    if (connectionTags) {
      connectionTags.start()
        .then(result => {
          console.log('Connected to Tags!');

          connectionTags.on('ReceiveMessage', message => {
            console.log(message);
            updateTag(message['tag'], message['value'])
          });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
    if (connectionAlarms) {
      connectionAlarms.start()
        .then(result => {
          console.log('Connected to Alarms!');

          connectionAlarms.on('ReceiveMessage', message => {
            if (message['user'] == getUserId() && activeAlarms.filter(alarm => alarm['address'] == message['address']).length == 0) {
              let alarms = [...activeAlarms];
              alarms.push(message);
              setActiveAlarms(alarms);
            }
          });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [connectionTags, connectionAlarms]);

  function updateTag(id, value) {
    setTags(tags.map(tag => { if (tag['id'] == id) { tag['value'] = value } return tag }))
  }

  function setAvailableAddresses(addresses, userTags, setAddresses) {
    let newAddresses = addresses.map(o => o['address'])
    for (let tag of userTags) {
      if (newAddresses.includes(tag['ioAddress'])) {
        const index = newAddresses.indexOf(tag['ioAddress']);
        if (index > -1) {
          newAddresses.splice(index, 1);
        }
      }
    }
    setAddresses(newAddresses)
  }

  return (
    <>
      <NavBar />
      <AllTags tags={tags} availableAnalogAddresses={availableAnalogAddresses} availableDigitalAddresses={availableDigitalAddresses} setTags={setTags} setAvailableAnalogAddresses={setAvailableAnalogAddresses} setAvailableDigitalAddresses={setAvailableDigitalAddresses} setUser={setUser} user={user} activeAlarms={activeAlarms} setActiveAlarms={setActiveAlarms} />
    </>
  )
}

function AllTags({ tags, availableAnalogAddresses, availableDigitalAddresses, setAvailableAnalogAddresses, setAvailableDigitalAddresses, setTags, setUser, user, activeAlarms, setActiveAlarms }) {
  const [addDigitalTag, setAddDigitalTag] = useState(false)
  const [addAnalogTag, setAddAnalogTag] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.tags}>
        <div>
          <div className={styles.addTag} onClick={() => setAddAnalogTag(!addAnalogTag)}>
            <h3>Add Analog Tag </h3>
            <Image alt='add tag' src='/images/plus.png' width={24} height={24} />
          </div>

          <div className={styles.addTag} onClick={() => setAddDigitalTag(!addDigitalTag)}>
            <h3>Add Digital Tag </h3>
            <Image alt='add tag' src='/images/plus.png' width={24} height={24} />
          </div>
        </div>
        <table className={styles.main_table}>
          <thead>
            <tr>
              <th>Tag Name</th>
              <th>Value</th>
              <th>Set value</th>
              <th>On Scan/Off Scan</th>
              <th>Delete</th>
              <th>Add Alarm</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => <Tag tag={tag} key={tag['ioAddress']} tags={tags} setTags={setTags} setUser={setUser} user={user} />)}
          </tbody>
        </table>

        {addAnalogTag && <NewAnalogTag availableAddresses={availableAnalogAddresses} setAddAnalogTag={setAddAnalogTag} setAvailableAddresses={setAvailableAnalogAddresses} tags={tags} setTags={setTags} />}
        {addDigitalTag && <NewDigitalTag availableAddresses={availableDigitalAddresses} setAddDigitalTag={setAddDigitalTag} setAvailableAddresses={setAvailableDigitalAddresses} tags={tags} setTags={setTags} />}
      </div>
      <div className={styles.alarms}>
        {activeAlarms.map(alarm => <Alarm key={alarm['address']} alarm={alarm} activeAlarms={activeAlarms} setActiveAlarms={setActiveAlarms} />)}
      </div>
    </div>
  );
}

function Tag({ tag, tags, setTags, setUser, user }) {
  const [isOn, setIsOn] = useState(tag['onOffScan']);
  const [addNewAlarm, setAddNewAlarm] = useState(false);
  const [newValue, setNewValue] = useState(0);

  function ChangeScanOnOff(answer) {
    if (tag['alarms']) {
      axios.put(`${baseUrl}/User/${getUserId()}/scanOnOff/analog/${tag['ioAddress']}`, null, { params: { answer: answer } }).then(_ => setIsOn(answer)).catch(err => console.log("Error on onOffScanAnalog"))
    } else {
      axios.put(`${baseUrl}/User/${getUserId()}/scanOnOff/digital/${tag['ioAddress']}`, null, { params: { answer: answer } }).then(_ => setIsOn(answer)).catch(err => console.log("Error on onOffScanDigital"))
    }
  }

  function deleteTag() {
    if (tag['alarms']) {
      axios.put(`${baseUrl}/User/${getUserId()}/delete/analog/${tag['ioAddress']}`, null).then(_ => removeTagFromTags()).catch(err => console.log("Error delete analog tag ", err))
    } else {
      axios.put(`${baseUrl}/User/${getUserId()}/delete/digital/${tag['ioAddress']}`, null).then(_ => removeTagFromTags()).catch(err => console.log("Error delete digital tag ", err))
    }
  }

  function removeTagFromTags() {
    const newUser = JSON.parse(JSON.stringify(user))
    if (tag['alarms']) {
      newUser['analogInputs'] = newUser['analogInputs'].filter(t => t['ioAddress'] != tag['ioAddress'])
    } else {
      newUser['digitalInputs'] = newUser['digitalInputs'].filter(t => t['ioAddress'] != tag['ioAddress'])
    }
    setUser(newUser)
    const newTags = [...tags].filter(t => t['ioAddress'] != tag['ioAddress'])
    setTags(newTags)
  }

  return <>
    <tr>
      <td>{tag['description']}</td>
      <td>{tag['value']}</td>
      <td>
        <input className={styles.inputField} type="text" id="newValue" name="newValue" value={newValue} onChange={e => setNewValue(e.target.value)} />
      </td>
      <td><div className={styles.IObtns}>
        <div className={`${styles.onBtn} ${isOn ? styles.black : ''}`} onClick={() => ChangeScanOnOff(true)}>On</div>
        <div className={`${styles.offBtn} ${isOn ? '' : styles.black}`} onClick={() => ChangeScanOnOff(false)}>Off</div>
      </div>
      </td>
      <td><div className={styles.icon} onClick={deleteTag}>
        <Image alt='remove' src='/images/remove.png' width={24} height={24} />
      </div></td>
      {tag['alarms'] && <td><div className={styles.icon} onClick={() => setAddNewAlarm(!addNewAlarm)}>
        <Image alt='add alarm' src='/images/add.png' width={24} height={24} />
      </div></td>}
    </tr>
    {(addNewAlarm && tag['alarms']) && <NewAlarm tag={tag} setAddNewAlarm={setAddNewAlarm} addNewAlarm={addNewAlarm} />}
  </>

}

function NewAnalogTag({ availableAddresses, setAddAnalogTag, setAvailableAddresses, tags, setTags }) {
  const [name, setName] = useState('')
  const [ioAddress, setIoAddress] = useState('')
  const [lowLimit, setLowLimit] = useState(0)
  const [highLimit, setHighLimit] = useState(0)
  const [scanTime, setScanTime] = useState(0)


  function AddNewAnalogTag() {
    if (name == '' || ioAddress == '' || scanTime == 0 || lowLimit > highLimit) {
      alert("Invalid inputs!")
      return;
    }
    const newTag = {
      "description": name,
      "ioAddress": ioAddress,
      "scanTime": scanTime,
      "lowLimit": lowLimit,
      "highLimit": highLimit
    }
    axios.post(`${baseUrl}/User/${getUserId()}/addTag/analog`, newTag).then(response => AddUserNewTag(response.data)).catch(err => console.log("Error on digital addresses"))
  }

  function AddUserNewTag(newTag) {
    let newTags = [...tags]
    newTags.push(newTag)
    setTags(newTags)
    availableAddresses.remove(ioAddress)
    setAvailableAddresses(...availableAddresses)
    setAddAnalogTag(false)
  }

  return <table className={styles.main_table}>
    <thead>
      <tr>
        <th>Tag Name</th>
        <th>I/O Address</th>
        <th>Low limit</th>
        <th>High limit</th>
        <th>Scan time</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <input className={styles.inputField} type="text" id="tagName" name="tagName" value={name} onChange={e => setName(e.target.value)} />
        </td>
        <td>
          <select name="ioAddress" id="ioAddress" value={ioAddress} onChange={e => setIoAddress(e.target.value)}>
            {availableAddresses.map(address => <option key={address} value={address}>{address}</option>)}
          </select>
        </td>
        <td>
          <input className={styles.inputField} type="number" id="lowLimit" name="lowLimit" value={lowLimit} onChange={e => setLowLimit(e.target.value)} />
        </td>
        <td>
          <input className={styles.inputField} type="number" id="highLimit" name="highLimit" value={highLimit} onChange={e => setHighLimit(e.target.value)} />
        </td>
        <td>
          <input className={styles.inputField} type="number" id="scanTime" name="scanTime" value={scanTime} onChange={e => setScanTime(e.target.value)} />
        </td>
        <td>
          <div onClick={() => AddNewAnalogTag()}>
            <Image alt='add tag' src='/images/plus.png' width={24} height={24} />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
}

function NewDigitalTag({ availableAddresses, setAddDigitalTag, setAvailableAddresses, tags, setTags }) {
  const [name, setName] = useState('')
  const [ioAddress, setIoAddress] = useState('')
  const [scanTime, setScanTime] = useState(0)


  function AddNewAnalogTag() {
    if (name == '' || ioAddress == '' || scanTime == 0) {
      alert("Invalid inputs!")
      return;
    }
    const newTag = {
      "description": name,
      "ioAddress": ioAddress,
      "scanTime": scanTime,
    }
    axios.post(`${baseUrl}/User/${getUserId()}/addTag/digital`, newTag).then(response => AddUserNewTag(response.data)).catch(err => console.log("Error on digital addresses"))
  }

  function AddUserNewTag(newTag) {
    let newTags = [...tags]
    newTags.push(newTag)
    setTags(newTags)
    availableAddresses.remove(ioAddress)
    setAvailableAddresses(...availableAddresses)
    setAddDigitalTag(false)
  }
  return <table className={styles.main_table}>
    <thead>
      <tr>
        <th>Tag Name</th>
        <th>I/O Address</th>
        <th>Scan time</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <input className={styles.inputField} type="text" id="tagName" name="tagName" value={name} onChange={e => setName(e.target.value)} />
        </td>
        <td>
          <select name="ioAddress" id="ioAddress" value={ioAddress} onChange={e => setIoAddress(e.target.value)}>
            {availableAddresses.map(address => <option key={address} value={address}>{address}</option>)}
          </select>
        </td>
        <td>
          <input className={styles.inputField} type="number" id="scanTime" name="scanTime" value={scanTime} onChange={e => setScanTime(e.target.value)} />
        </td>
        <td>
          <div onClick={() => AddNewAnalogTag()}>
            <Image alt='add tag' src='/images/plus.png' width={24} height={24} />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
}

function NewAlarm({ tag, addNewAlarm, setAddNewAlarm }) {
  const [direction, setDirection] = useState('notify_if_greater');
  const [alarmValue, setValue] = useState('');
  const [priority, setPriority] = useState('1');

  function AddNewTagAlarm() {
    if (alarmValue == null || alarmValue == '' || alarmValue.startsWith('e')) {
      alert("Invalid inputs!")
      return;
    }
    const alarm = {
      'direction': direction,
      'value': +alarmValue,
      'priority': priority
    }

    axios.post(`${baseUrl}/User/${getUserId()}/alarm/${tag['ioAddress']}`, alarm).then(_ => { setAddNewAlarm(false); alert("Alarm added successfully.") }).catch(err => console.log("Error on addNewAlarm"))

  }

  return <tr className={styles.addAlarm}>
    <td>Current value</td>
    <td>
      <select className={styles.inputField} name="direction" id="direction" value={direction} onChange={e => setDirection(e.target.value)}>
        <option value='notify_if_greater'>greater</option>
        <option value='notify_if_lower'>lower</option>
      </select>
    </td>
    <td>then</td>
    <td>
      <input className={styles.inputField} type="number" id="value" name="value" value={alarmValue} onChange={e => setValue(e.target.value)} placeholder='Specific value' />
    </td>
    <td>
      <span>Priority: </span>
      <select className={styles.inputField} name="priority" id="priority" value={priority} onChange={e => setPriority(e.target.value)}>
        <option value='1'>LOW</option>
        <option value='2'>MEDIUM</option>
        <option value='3'>HIGH</option>
      </select>
    </td>
    <td>
      <div onClick={AddNewTagAlarm}>
        <Image alt='add tag' src='/images/plus.png' width={24} height={24} />
      </div>
    </td>
  </tr>
}

function Alarm({ alarm, activeAlarms, setActiveAlarms }) {

  function discardAlarm() {
    let newAlarms = [...activeAlarms];
    newAlarms = newAlarms.filter(item => item['address'] != alarm['address']);
    setActiveAlarms(newAlarms);
  }

  return <div className={`${styles.alarm} alarm${alarm['priority']}`}>
    <div>
      <Image src={`/images/alarm${alarm['priority']}`} width={30} height={30} alt={`Alarm ${alarm['priority']}`} />
    </div>
    <div className={styles.alarmContent}>
      <h2>{alarm}</h2>
      <p>{alarm['priority'] == '1' ? 'Important' : alarm['priority'] == '2' ? 'Urgent' : 'Critical'}</p>
    </div>
    <div>
      <Image src={`/images/x-mark`} width={30} height={30} alt='X' onClick={discardAlarm} />
    </div>
  </div>
}

// Send message to signalR
const sendMessage = async (user, message) => {
  const chatMessage = {
    user: user,
    message: message
  };

  if (connection.connectionStarted) {
    try {
      await connection.send('SendMessage', chatMessage);
    }
    catch (e) {
      console.log(e);
    }
  }
  else {
    alert('No connection to server yet.');
  }
}
