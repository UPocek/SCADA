import '@/styles/globals.css'

export const baseUrl = 'https://localhost:7214/api'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
