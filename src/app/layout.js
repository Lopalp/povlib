import "./globals.css";
import UserProvider from "../../context/UserProvider";
import GlobalLayout from "../components/layout/GlobalLayout";
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "POVlib - CS2 Pro-POV Library",
  description: "The ultimate CS2 Pro-POV library",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">
        <UserProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </UserProvider>
      </body>
    </html>
  );
}
