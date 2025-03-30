import Script from 'next/script.js';
import POVlib from '../components/POVlib.jsx';

export default function Home() {
  return (
    <main>
      {/* <Script src="https://accounts.google.com/gsi/client" async /> */}
      <POVlib />
    </main>
  )
}