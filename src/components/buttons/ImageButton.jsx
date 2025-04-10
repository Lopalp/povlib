import React from 'react'

const ImageButton = ({ size, onClick, imageSrc, altText }) => {
    return (
        <button
            onClick={onClick}
            className={`rounded-full overflow-hidden focus:outline-none`}
            style={{ width: size, height: size }}
        >
            <img
                src={imageSrc}
                alt={altText}
                className="w-full h-full object-cover"
            />
        </button>
    );
};

export default ImageButton;