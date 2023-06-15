import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import NavBar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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