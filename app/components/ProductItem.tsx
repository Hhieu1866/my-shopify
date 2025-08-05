import {useVariantUrl} from '~/lib/variants';
import {ProductItemFragment} from '../../storefrontapi.generated';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';

type ProductItemProps = {
  product: ProductItemFragment; 
  loading?: 'eager' | 'lazy';
  hidePrice?: boolean;
};

const ProductItem = ({product, loading, hidePrice}: ProductItemProps) => {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  const firstImage = product.featuredImage;
  const secondImage = product.images.nodes[1];
  return (
    <Link
      className="group relative block"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* image container with hover effect */}
      <div className="relative mb-6 aspect-square overflow-hidden bg-brand-cream">
        {firstImage && (
          <>
            <Image
              alt={firstImage.altText || product.title}
              data={firstImage}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              loading={loading}
              className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            {secondImage && (
              <Image
                alt={secondImage.altText || product.title + ' - Second Image'}
                data={secondImage}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                loading={loading}
                className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
            {/* overlay on hover */}
            <div className="absolute inset-0 bg-brand-navy/0 transition-colors duration-500 group-hover:bg-brand-navy/20" />

            {/* quick view button */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full transform p-4 ring-0 transition-transform duration-500 ease-out group-hover:translate-y-0">
              <div className="bg-white/90 px-4 py-3 text-center backdrop-blur-sm">
                <span className="font-source text-sm font-medium tracking-wide text-brand-navy">
                  View Details
                </span>
              </div>
            </div>
          </>
        )}

        {/* corner accents */}
        <div className="absolute left-4 top-4 size-8 border-l-2 border-t-2 border-brand-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div className="absolute bottom-4 right-4 size-8 border-b-2 border-r-2 border-brand-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      </div>

      {/* product information */}
      <div className="relative">
        <h4 className="mb-2 font-playfair text-lg text-brand-navy transition-colors duration-500 group-hover:text-brand-gold">
          {product.title}
        </h4>
        <div className="flex items-baseline justify-between">
          {!hidePrice && (
            <Money
              data={product.priceRange.minVariantPrice}
              className="font-source text-gray-600 transition-colors duration-500 group-hover:text-brand-navy"
            />
          )}

          <span className="flex items-center font-source text-sm text-brand-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            Explore <ArrowRight className="ml-1 size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
