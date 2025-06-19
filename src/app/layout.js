import "./globals.css";
import UserProvider from "../../context/UserProvider";
import GlobalLayout from "../components/layout/GlobalLayout";
import { Analytics } from "@vercel/analytics/next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "POVlib - CS2 Pro-POV Library",
  description: "The ultimate CS2 Pro-POV library",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`bg-gray-900 text-white ${poppins.className}`}>
        <UserProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </UserProvider>
      </body>
    </html>
  );
}
