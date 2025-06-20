jsx
// src/app/your-matches/page.jsx
import React from 'react';
import SectionHeading from '../../components/headings/SectionHeading';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import BodyText from '../../components/typography/BodyText';

const demoMatches = [
  {
    id: 1,
    map: 'Mirage',
    date: '2023-10-26',
    platform: 'Faceit',
    kills: 25,
    deaths: 18,
    kd: '1.39',
    hltvRating: '1.25',
  },
  {
    id: 2,
    map: 'Inferno',
    date: '2023-10-25',
    platform: 'Premiere',
    kills: 19,
    deaths: 21,
    kd: '0.90',
    hltvRating: '0.98',
  },
  {
    id: 3,
    map: 'Dust 2',
    date: '2023-10-24',
    platform: 'Pro',
    kills: 32,
    deaths: 15,
    kd: '2.13',
    hltvRating: '1.55',
  },
  {
    id: 4,
    map: 'Nuke',
    date: '2023-10-23',
    platform: 'Faceit',
    kills: 14,
    deaths: 22,
    kd: '0.64',
    hltvRating: '0.78',
  },
];

const YourMatchesPage = () => {
  const remainingTokens = 10; // Placeholder for remaining tokens

  return (
    <div className="min-h-screen bg-gray-900 text-gray-400 p-8">
      <div className="container mx-auto">
        <SectionHeading title="Your Matches" />

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <PrimaryButton>Connect Steam</PrimaryButton>
            <PrimaryButton>Connect Faceit</PrimaryButton>
          </div>
          <div className="text-lg font-semibold text-yellow-500">
            Remaining Tokens: {remainingTokens}
          </div>
        </div>

        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Map
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Datum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Plattform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Kills
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Deaths
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  K/D
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  HLTV Rating
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Generate Video</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {demoMatches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {match.map}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {match.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {match.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {match.kills}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {match.deaths}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {match.kd}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {match.hltvRating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Replace with actual video generation logic */}
                    <SecondaryButton onClick={() => alert(`Generate video for match ${match.id}`)}>
                      Generate Video
                    </SecondaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default YourMatchesPage;