import { useState } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  images?: string[];
}

export default function ProductPictures({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);

  // If no images, show placeholder
  const images = product.images?.length ? product.images : ['/placeholder.png'];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-square relative rounded-2xl overflow-hidden bg-[#F7F8FB]">
        <Image
          src={images[selectedImage]}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square relative rounded-lg overflow-hidden ${
                selectedImage === index ? 'ring-2 ring-[#C1CF16]' : ''
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image}
                alt={`${product.name} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 