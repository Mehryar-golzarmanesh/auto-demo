'use client'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

interface ImageSliderProps {
  imageUrls: string[]
}

const ImageSlider = ({ imageUrls }: ImageSliderProps) => {
  const [imageIndex, setImageIndex] = useState(0)

  function showNextImage() {
    setImageIndex((index) => {
      if (index === imageUrls.length - 1) return 0
      return index + 1
    })
  }

  function showPrevImage() {
    setImageIndex((index) => {
      if (index === 0) return imageUrls.length - 1
      return index - 1
    })
  }

  return (
    <div className="w-full h-full relative">
      <Image
        src={imageUrls[imageIndex]}
        alt={`اسلاید شماره ${imageIndex}`}
        width={1200}
        height={1000}
        className="object-cover w-full h-full rounded-xl"
      />
      <button
        className="absolute left-0 top-0 bottom-0 cursor-pointer p-4 hover:bg-black/10"
        onClick={showPrevImage}
      >
        <ArrowLeft />
      </button>
      <button
        className="absolute right-0 top-0 bottom-0 cursor-pointer p-4 hover:bg-black/10"
        onClick={showNextImage}
      >
        <ArrowRight />
      </button>
    </div>
  )
}

export default ImageSlider
