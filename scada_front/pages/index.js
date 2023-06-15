import Head from 'next/head'
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
  const [connection, setConnection] = useState(null);
   const [user, setUser] = useState({})
  const [tags, setTags] = useState([])
  const [availableAnalogAddresses, setAvailableAnalogAddresses] = useState([])
  const [availableDigitalAddresses, setAvailableDigitalAddresses] = useState([])

  useEffect(() => {
    let user = JSON.parse(getUser())
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
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7214/hubs/tags')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(result => {
          console.log('Connected!');

          connection.on('ReceiveMessage', message => {
            console.log(message);
          });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [connection]);

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
      <AllTags tags={tags} availableAnalogAddresses={availableAnalogAddresses} availableDigitalAddresses={availableDigitalAddresses} setTags={setTags} setAvailableAnalogAddresses={setAvailableAnalogAddresses} setAvailableDigitalAddresses={setAvailableDigitalAddresses} />
    </>
  )
}

function AllTags({ tags, availableAnalogAddresses, availableDigitalAddresses, setAvailableAnalogAddresses, setAvailableDigitalAddresses, setTags }) {
  const [addDigitalTag, setAddDigitalTag] = useState(false)
  const [addAnalogTag, setAddAnalogTag] = useState(false)

  return (
    <div className={styles.container}>
      <div>
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
            {tags.map(tag => <Tag tag={tag} key={tag['ioAddress']} />)}
          </tbody>
        </table>

        {addAnalogTag && <NewAnalogTag availableAddresses={availableAnalogAddresses} setAddAnalogTag={setAddAnalogTag} setAvailableAddresses={setAvailableAnalogAddresses} tags={tags} setTags={setTags} />}
        {addDigitalTag && <NewDigitalTag availableAddresses={availableDigitalAddresses} setAddDigitalTag={setAddDigitalTag} setAvailableAddresses={setAvailableDigitalAddresses} tags={tags} setTags={setTags} />}

      </div>
      <div className={styles.addTag} onClick={() => setAddAnalogTag(true)}>
        <h3>Add Analog Tag </h3>
        <Image alt='add tag' src='/images/plus.png' width={24} height={24} />
      </div>

      <div className={styles.addTag} onClick={() => setAddDigitalTag(true)}>
        <h3>Add Digital Tag </h3>
        <Image alt='add tag' src='/images/plus.png' width={24} height={24} />
      </div>
    </div>

  );
}

function Tag({ tag }) {
  const [isOn, setIsOn] = useState(false);
  const [newValue, setNewValue] = useState(0);
  return <tr>
    <td>{tag['description']}</td>
    <td>{tag['value']}</td>
    <td>
      <input className={styles.inputField} type="text" id="newValue" name="newValue" value={newValue} onChange={e => setNewValue(e.target.value)} />
    </td>
    <td><div className={styles.IObtns}>
      <div className={`${styles.onBtn} ${isOn ? styles.black : ''}`} onClick={() => setIsOn(true)}>On</div>
      <div className={`${styles.offBtn} ${isOn ? '' : styles.black}`} onClick={() => setIsOn(false)}>Off</div>
    </div>
    </td>
    <td><div className={styles.icon}>
      <Image alt='remove' src='/images/remove.png' width={24} height={24} />
    </div></td>
    <td><div className={styles.icon}>
      <Image alt='add alarm' src='/images/add.png' width={24} height={24} />
    </div></td>
  </tr>
}

function NewAnalogTag({ availableAddresses, setAddAnalogTag, setAvailableAddresses, tags, setTags }) {
  const [name, setName] = useState('')
  const [ioAddress, setIoAddress] = useState('')
  const [lowLimit, setLowLimit] = useState(0)
  const [highLimit, setHighLimit] = useState(0)
  const [scanTime, setScanTime] = useState(0)


  function AddNewAnalogTag() {
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