import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import NavBar from '@/components/navbar'
import { useEffect, useState } from 'react'
import { getUserId } from '@/helper/helper'
import axios from 'axios'
import { baseUrl } from './_app'
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();
  const [connectionTags, setConnectionTags] = useState(null);
  const [connectionAlarms, setConnectionAlarms] = useState(null);
  const [tags, setTags] = useState([]);
  const [controls, setControls] = useState([]);
  const [availableAnalogAddresses, setAvailableAnalogAddresses] = useState([]);
  const [availableDigitalAddresses, setAvailableDigitalAddresses] = useState([]);
  const [activeAlarms, setActiveAlarms] = useState([]);

  useEffect(() => {
    localStorage.getItem('user') == null && router.replace('/login');
    if (localStorage.getItem('user')) {
      axios.get(`${baseUrl}/User/userTagsInfo/${getUserId()}`).then(response => updateUserInfo(response.data)).catch(err => console.log("Error on user tags info"));
    }
    axios.get(`${baseUrl}/Tags/controls`).then(response => setControls(response.data)).catch(err => console.log("Error on controls addresses"));
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
            console.log(message);
            if (message['user'] == getUserId() && activeAlarms.filter(alarm => alarm['message'] == message['message']).length == 0) {
              let alarmsNew = [...activeAlarms];
              alarmsNew.push(message);
              setActiveAlarms(alarmsNew);
            }
          });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [connectionTags, connectionAlarms]);

  function updateTag(id, value) {
    if (tags.length <= 0) {
      console.log("NEEEE")
      return;
    }
    let updatedTags = [...tags]
    for (let tag of updatedTags) {
      if (tag['id'] == id) {
        tag['value'] = value
      }
    }
    setTags(updatedTags);
  }

  function updateUserInfo(data) {
    let userTags = [];
    userTags.push(...data['analogInputs']);
    userTags.push(...data['digitalInputs']);
    setTags(userTags);
    setAvailableAnalogAddresses([...data['availableAnalogInputs']]);
    setAvailableDigitalAddresses([...data['availableDigitalInputs']]);
  }

  return (
    <>
      <NavBar />
      <AllTags tags={tags} availableAnalogAddresses={availableAnalogAddresses} availableDigitalAddresses={availableDigitalAddresses} setTags={setTags} setAvailableAnalogAddresses={setAvailableAnalogAddresses} setAvailableDigitalAddresses={setAvailableDigitalAddresses} activeAlarms={activeAlarms} setActiveAlarms={setActiveAlarms} controls={controls} setControls={setControls} />
    </>
  )
}

function AllTags({ tags, availableAnalogAddresses, availableDigitalAddresses, setAvailableAnalogAddresses, setAvailableDigitalAddresses, setTags, setUser, user, activeAlarms, setActiveAlarms, controls, setControls }) {
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
            {tags.map(tag => <Tag tag={tag} key={tag['ioAddress']} tags={tags} setTags={setTags} controls={controls} />)}
          </tbody>
        </table>

        {addAnalogTag && <NewAnalogTag availableAddresses={availableAnalogAddresses} setAddAnalogTag={setAddAnalogTag} setAvailableAddresses={setAvailableAnalogAddresses} tags={tags} setTags={setTags} />}
        {addDigitalTag && <NewDigitalTag availableAddresses={availableDigitalAddresses} setAddDigitalTag={setAddDigitalTag} setAvailableAddresses={setAvailableDigitalAddresses} tags={tags} setTags={setTags} />}
      </div>
      <div className={styles.alarms}>
        {activeAlarms.map(alarm => <Alarm key={alarm['message']} alarm={alarm} activeAlarms={activeAlarms} setActiveAlarms={setActiveAlarms} />)}
      </div>
    </div>
  );
}

function Tag({ tag, tags, setTags, controls }) {
  const [isOn, setIsOn] = useState(tag['onOffScan']);
  const [addNewAlarm, setAddNewAlarm] = useState(false);
  const [oldValue, setOldValue] = useState(0);
  const [valueChange, setValueChange] = useState(0);

  useEffect(() => {
    setOldValue(controls.find(item => item['address'] == tag['ioAddress']) ? controls.find(item => item['address'] == tag['ioAddress'])['value'] : 0);
    setValueChange(controls.find(item => item['address'] == tag['ioAddress']) ? controls.find(item => item['address'] == tag['ioAddress'])['value'] : 0);
  }, [controls])


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
    const newTags = [...tags].filter(t => t['ioAddress'] != tag['ioAddress'])
    setTags(newTags)
  }

  function controlSystem(e) {
    const newValueToSet = e.target.newValue ? e.target.newValue.value : e.target.value;
    e.preventDefault();
    axios.put(`${baseUrl}/Tags/control/${tag['ioAddress']}?value=${newValueToSet}&type=${tag['alarms'] ? 'analog' : 'digital'}`).then(response => { alert(`${tag['description']} set to ${newValueToSet}`); setOldValue(newValueToSet); }).catch(err => { alert("Value not set!"); setValueChange(oldValue); })
  }

  return <>
    <tr>
      <td>{tag['description']}</td>
      <td>{tag['value']}</td>
      <td>
        <form onSubmit={controlSystem}>
          {tag['alarms'] ? <input className={styles.inputField} type="text" id="newValue" name="newValue" value={valueChange} onChange={e => setValueChange(e.target.value)} /> : <select id="newValue" name="newValue" value={oldValue} className={styles.inputField} onChange={controlSystem}><option value={0}>0</option> <option value={1}>1</option></select>}
        </form>
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
  const [name, setName] = useState('');
  const [ioAddress, setIoAddress] = useState(availableAddresses[0]);
  const [lowLimit, setLowLimit] = useState(0);
  const [highLimit, setHighLimit] = useState(0);
  const [scanTime, setScanTime] = useState(0);


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
    axios.post(`${baseUrl}/User/${getUserId()}/addTag/analog`, newTag).then(response => AddUserNewTag(response.data)).catch(err => console.log(err))
  }

  function AddUserNewTag(newTag) {
    let newTags = [...tags];
    newTags.push(newTag);
    setTags(newTags);
    const index = availableAddresses.indexOf(ioAddress);
    if (index > -1) {
      availableAddresses.splice(index, 1);
    }
    setAvailableAddresses(...availableAddresses);
    setAddAnalogTag(false);
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
  const [name, setName] = useState('');
  const [ioAddress, setIoAddress] = useState(availableAddresses[0]);
  const [scanTime, setScanTime] = useState(0);


  function AddNewDigitalTag() {
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
    const index = availableAddresses.indexOf(ioAddress);
    if (index > -1) {
      availableAddresses.splice(index, 1);
    }
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
          <div onClick={() => AddNewDigitalTag()}>
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
    newAlarms = newAlarms.filter(item => (item['message'] != alarm['message']));
    setActiveAlarms(newAlarms);
  }

  return <div className={`${styles.alarm} alarm${alarm['priority']}`}>
    <div>
      <Image src={`/images/alarm${alarm['priority']}.png`} width={50} height={50} alt={`Alarm ${alarm['priority']}`} />
    </div>
    <div className={styles.alarmContent}>
      <h3>{alarm['message']}</h3>
      <p>{alarm['priority'] == '1' ? 'Important' : alarm['priority'] == '2' ? 'Urgent' : 'Critical'}</p>
    </div>
    <div>
      <Image className={styles.cross} src={`/images/x-mark.png`} width={30} height={30} alt='X' onClick={discardAlarm} />
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
