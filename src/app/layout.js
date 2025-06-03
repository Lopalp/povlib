import './globals.css'
import UserProvider from '../../context/UserProvider'
import {Quicksand} from 'next/font/google'

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'], // Specify the weights you need
  // If you want to use it as a CSS variable:
  // variable: '--font-quicksand',
  display: "swap",
});

export const metadata = {
  title: 'POVlib - CS2 Pro-POV Library',
  description: 'The ultimate CS2 Pro-POV library',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark ${quicksand.className}'>
      <body className="bg-gray-900 text-white">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}