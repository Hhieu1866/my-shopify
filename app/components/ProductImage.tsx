import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import {ChevronLeft, ChevronRight, X} from 'lucide-react';

type GalleryImage = {
  id?: string | null;
  url?: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ProductImageProps = {
  selectedVariantImage: ProductVariantFragment['image'];
  images: GalleryImage[];
};

const ProductImage = ({images, selectedVariantImage}: ProductImageProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number>(0);

  const [touchStart, setTouchStart] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const allImages = selectedVariantImage
    ? [
        selectedVariantImage,
        ...images.filter((img) => img.id !== selectedVariantImage.id),
      ]
    : images;

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    const offset = currentTouch - touchStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const minSwipeDistance = 50;
    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1);
        if (modalOpen) setModalIndex((prev) => prev - 1);
      } else if (dragOffset < 0 && selectedIndex < allImages.length - 1) {
        setSelectedIndex((prev) => prev + 1);
        if (modalOpen) setModalIndex((prev) => prev + 1);
      }

      setIsDragging(false);
      setDragOffset(0);
    }
  };

  const getImagePosition = (index: number) => {
    const baseTransform = isDragging ? dragOffset : 0;
    const diff = index - (modalOpen ? modalIndex : selectedIndex);
    return `translate3d(calc(${diff * 100}% + ${baseTransform}px), 0,0)`;
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  if (allImages.length < 1) {
    return (
      <div className="aspect-square animate-pulse rounded-lg bg-brand-cream" />
    );
  }

  return (
    <>
      {/* image carousel */}
      <div className="space-y-4">
        {/* main image container */}

        <div
          onClick={() => !isDragging && openModal(selectedIndex)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-square cursor-zoom-in overflow-hidden rounded-lg bg-brand-cream"
        >
          {/* image container */}
          <div className="absolute inset-0">
            {allImages.map((image, index) => (
              <div
                key={`image-${image.id || index}`}
                className={`absolute inset-0 size-full transition-transform duration-300 ease-out ${
                  !isDragging
                    ? 'transition-transform duration-300'
                    : 'transition-none'
                }`}
                style={{transform: getImagePosition(index)}}
              >
                <Image
                  alt={image.altText || 'Product Image'}
                  data={image}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* navigation arrows -desktop */}
          <div className="absolute inset-0 items-center justify-between px-4 opacity-0 transition-opacity hover:opacity-100 md:flex">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedIndex > 0) {
                  setSelectedIndex((prev) => prev - 1);
                }
              }}
              className="rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
              disabled={selectedIndex === 0}
            >
              <ChevronLeft className="size-6 text-brand-navy" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedIndex < allImages.length - 1) {
                  setSelectedIndex((prev) => prev + 1);
                }
              }}
              className="rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
              disabled={selectedIndex === allImages.length - 1}
            >
              <ChevronRight className="size-6 text-brand-navy" />
            </button>
          </div>
        </div>

        {/* thumbnail strip */}
        <div className="hidden gap-4 px-1 py-2 md:grid md:grid-cols-[repeat(auto-fill,_5rem)]">
          {allImages.map((image, index) => (
            <button
              // eslint-disable-next-line react/no-array-index-key
              key={`thumbnail-${index}-${image.id || 'x'}`}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square w-20 overflow-hidden rounded-md transition-all duration-300 ease-out ${
                selectedIndex === index
                  ? 'ring-2 ring-brand-gold ring-offset-2'
                  : 'opacity-70 hover:opacity-100 hover:ring-2 hover:ring-brand-navy/10 hover:ring-offset-2'
              }`}
            >
              <Image
                alt={image.altText || 'Product Thumbnail'}
                data={image}
                sizes="80px"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* dot indicators */}
        <div className="mt-4 flex justify-center space-x-2 md:hidden">
          {allImages.map((_, index) => (
            <button
              // eslint-disable-next-line react/no-array-index-key
              key={`dot-${index}`}
              onClick={() => setSelectedIndex(index)}
              className={`size-2 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? 'w-4 bg-brand-gold'
                  : 'bg-brand-navy/20 hover:bg-brand-navy/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* modal/popup */}
      {modalOpen && (
        <div className="fixed inset-0 left-0 top-0 z-50 !my-0 size-full bg-black/95 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-hidden">
            {/* close button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-50 p-2 text-white/80 transition-colors hover:text-white"
            >
              <X className="size-6" />
            </button>

            {/* image counter */}
            <div className="absolute left-4 top-4 z-50">
              <p className="font-source text-sm text-white/80">
                {modalIndex + 1}/{allImages.length}
              </p>
            </div>

            {/* modal image */}
            <div
              className="flex size-full items-center justify-center p-0 md:p-8"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative h-full w-full">
                {allImages.map((image, index) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`modal-image-${image.id || 'X'}-${index}`}
                    className={`absolute inset-0 size-full transition-transform duration-300 ease-out ${
                      !isDragging
                        ? 'transition-transform duration-300'
                        : 'transition-none'
                    }`}
                    style={{transform: getImagePosition(index)}}
                  >
                    <div className="relative flex size-full items-center justify-center">
                      <Image
                        alt={image.altText || 'Product Image'}
                        data={image}
                        sizes="90vw"
                        className="max-h-[85vh] max-w-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* navigation modal arrows */}
            <div className="absolute inset-0 hidden items-center justify-between px-4 md:flex">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (modalIndex > 0) {
                    setModalIndex((prev) => prev - 1);
                  }
                }}
                className="rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
                disabled={modalIndex === 0}
              >
                <ChevronLeft className="size-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (modalIndex < allImages.length - 1) {
                    setModalIndex((prev) => prev + 1);
                  }
                }}
                className="rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
                disabled={modalIndex === allImages.length - 1}
              >
                <ChevronRight className="size-8" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImage;
