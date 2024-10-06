import React from 'react';

interface ImageUploaderProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  maxImages: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages, maxImages }) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages(prevImages => [...prevImages, ...newImages].slice(0, maxImages));
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        disabled={images.length >= maxImages}
      />
      <div>
        {images.map((image, index) => (
          <img
            key={index}
            src={URL.createObjectURL(image)}
            alt={`Uploaded ${index + 1}`}
            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;