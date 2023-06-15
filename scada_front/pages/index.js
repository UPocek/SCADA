import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import NavBar from '@/components/navbar'
import { useEffect, useState } from 'react'
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();
  const [connection, setConnection] = useState(null);
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

  return (
    <>
      <NavBar />
    </>
  )
}

function AllTags() {

  return (
    <table className={styles.main_table}>
      <thead>
        <tr>
          <th>valid</th>
          <th>valid</th>
          <th>valid</th>
          <th>valid</th>
          <th>valid</th>
        </tr>
      </thead>
      <tbody>

      </tbody>
    </table>
  );

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