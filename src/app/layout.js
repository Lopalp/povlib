import './globals.css'
import UserProvider from '../../context/UserProvider'
import Navbar from '@/components/POVlib/Navbar';
import NavbarProvider from '../../context/NavbarProvider';
import DemoProvider from '../../context/DemoProvider';
import {
  getFilteredDemos,
  getTrendingDemos,
  getLatestDemos,
  getDemosByMap,
  getDemosByPosition,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions,
  getPlayerInfo
} from '../lib/supabase';
import { mapDemo } from '../lib/utils';
import deafaultDemoFilters, { defaultDemoFilters } from '@/lib/constants';

export const metadata = {
  title: 'POVlib - CS2 Pro-POV Library',
  description: 'The ultimate CS2 Pro-POV library',
}

export default async function RootLayout({ children }) {


  const fetchInitialDemos = async () => {
    try {
      const options = await getFilterOptions();

      const [demos, trending, latest] = await Promise.all([
        getFilteredDemos(defaultDemoFilters, "pro"),
        getTrendingDemos(5, "pro"),
        getLatestDemos(5, "pro")
      ]);
      
      return {
        filteredDemos: demos.map(mapDemo),
        trendingDemos: trending.map(mapDemo),
        latestDemos: latest.map(mapDemo),
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const initalDemos = await fetchInitialDemos();

  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">
        <UserProvider>
          <NavbarProvider>
            <DemoProvider initialDemos={initalDemos}>
              <Navbar />
              {children}
            </DemoProvider>
          </NavbarProvider>
        </UserProvider>
      </body>
    </html>
  )
}