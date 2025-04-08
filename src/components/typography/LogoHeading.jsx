import React from 'react';

const LogoHeading = ({ size }) => {
    return (
        <div style={{display: "flex", flexDirection: "row", gap: "0.5rem"}}>
            {/* <div className={`relative w-${3 * size} h-${3 * size} bg-yellow-400 rounded-full flex items-center justify-center`}>
              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
              <span className="text-gray-900 font-black text-lg">P</span>
            </div> */}
            <h1 className={`text-${size}xl font-black`}>
                <span className="text-yellow-400">POV</span>
                <span className="text-white">lib</span>
                <span className="text-gray-400 text-xl">.gg</span>
            </h1>
        </div>
    );
};

export default LogoHeading;