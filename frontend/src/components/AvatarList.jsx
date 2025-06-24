import React from 'react'

const AvatarList = ({ images }) => {
  return (
    <div className="flex items-center">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Avatar ${index + 1}`}
          className={`w-16 h-16 rounded-full border-2 border-white object-cover ${
            index !== 0 ? '-ml-4' : ''
          }`}
        />
      ))}
    </div>
  )
}

export default AvatarList
