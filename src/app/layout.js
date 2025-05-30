import './globals.css'
import UserProvider from '../../context/UserProvider'

export const metadata = {
  title: 'POVlib - CS2 Pro-POV Library',
  description: 'The ultimate CS2 Pro-POV library',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}