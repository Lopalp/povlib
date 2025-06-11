import "./globals.css";
import UserProvider from "../../context/UserProvider";
import { Poppins } from "next/font/google";
import GlobalLayout from "../components/layout/GlobalLayout";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"], // Specify the weights you need
  // If you want to use it as a CSS variable:
  // variable: '--font-poppins',
  display: "swap",
});

export const metadata = {
  title: "POVlib - CS2 Pro-POV Library",
  description: "The ultimate CS2 Pro-POV library",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${poppins.className}`}>
      <body className="bg-gray-900 text-white">
        <UserProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </UserProvider>
      </body>
    </html>
  );
}
