import POVlib from '../components/POVlib.jsx';
import FeaturedHero from '@/components/content/FeaturedHero.jsx';
import SelectedFilters from '@/components/POVlib/SelectedFilters.jsx';
import DemoFilters from '@/components/menus/DemoFilters.jsx';

export default function Home() {

	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">

        	<FeaturedHero />

			<main className="container mx-auto px-6 py-6 bg-pattern">

				<SelectedFilters />

				<DemoFilters />

			</main>

			</div>
		</>
	)
}