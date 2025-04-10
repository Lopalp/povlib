import POVlib from '../components/POVlib.jsx';
import FeaturedHero from '@/components/POVlib/FeaturedHero.jsx';

export default function Home() {

	return (
		<main>
			<div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">

			{filteredDemos.length > 0 && !selectedDemo && (
				<FeaturedHero
				demo={filteredDemos[1]}
				autoplayVideo={autoplayVideo}
				setSelectedDemo={onSelectDemo}
				setActiveVideoId={setActiveVideoId}
				setIsFilterModalOpen={setIsFilterModalOpen}
				/>
			)}

			</div>
		</main>
	)
}