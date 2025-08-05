import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

import {ArrowRight, Star} from 'lucide-react';
import ProductItem from '~/components/ProductItem';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {/* hero section */}
      <section className="relative h-screen min-h-[600px] bg-brand-navy">
        <Image
          alt="Craftsmanship"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="eager"
          data={{
            url: '/images/banner.png',
            width: 1920,
            height: 1080,
          }}
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl">
            <h1 className="mb-6 font-playfair text-4xl text-white md:text-6xl">
              Artisanal Footwear for the Modern Sophisticate
            </h1>
            <p className="mb-8 font-source text-lg text-gray-200">
              Handcrafted excellence, designed for distinction
            </p>
            <Link
              to="collections/all"
              className="inline-flex items-center bg-brand-gold px-8 py-4 font-source font-medium text-white transition-colors duration-300 hover:bg-brand-goldDark"
            >
              Explore Collection
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* recommended products */}
      <section className="bg-white px-4 py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center font-playfair text-3xl">
            Our Latest Products
          </h2>
          <div>
            <Suspense
              fallback={
                // Hiển thị hiệu ứng skeleton loader khi nội dung đang load
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {Array.from({length: 4}).map((_, i) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={`skeleton-${i}`}
                      className="flex animate-pulse flex-wrap gap-4"
                    >
                      <div className="size-20 rounded bg-gray-200" />
                      <div className="size-20 rounded bg-gray-200" />
                      <div className="size-20 rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
              }
            >
              <Await resolve={data.recommendedProducts}>
                {(response) => (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {response?.products.nodes.map((product) => (
                      <ProductItem
                        key={product.id}
                        product={product}
                        loading="lazy"
                        hidePrice
                      />
                    ))}
                  </div>
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </section>

      {/* craftsmanship section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="">
              <Image
                alt="Craftsmanship"
                className="w-full"
                data={{
                  url: '/images/craftsmanship.png',
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px). 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="max-w-xl">
              <h2 className="mb-6 font-playfair text-3xl">
                Crafted by Master Artisans
              </h2>
              <p className="mb-8 font-source leading-relaxed text-gray-600">
                Each ELOWEN shoe reflects a legacy of skilled craftsmanship,
                handcrafted with precision over more than 30 hours. Our expert
                artisans blend traditional methods with modern design to deliver
                footwear of outstanding quality.
              </p>
              <Link
                to="/pages/our-craft"
                className="inline-flex items-center font-source font-medium text-brand-navy transition-colors duration-300 hover:text-brand-gold"
              >
                Discover Our Process
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* testimonial section */}
      <section className="bg-brand-navy px-4 py-20 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center gap-0.5">
            {Array.from({length: 5}).map((_, i) => (
              <Star
                // eslint-disable-next-line react/no-array-index-key
                key={`start-${i}`}
                fill="#c3a343"
                color="#e0b840"
                className="mb-8 size-8"
              />
            ))}
          </div>
          <blockquote className="mb-8 font-playfair text-2xl md:text-3xl">
            Every ELOWEN shoe is a refined expression of impeccable
            craftsmanship and precision — a true embodiment of artisanal luxury.
          </blockquote>
          <cite className="font-source not-italic text-gray-300">
            - The Luxury Report
          </cite>
        </div>
      </section>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}

      <h1>{collection.title}</h1>
    </Link>
  );
}

// function RecommendedProducts({
//   products,
// }: {
//   products: Promise<RecommendedProductsQuery | null>;
// }) {
//   return (
//     <div className="recommended-products">
//       <h2 className="font-playfair text-2xl font-bold text-brand-gold">
//         Recommended Products
//       </h2>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Await resolve={products}>
//           {(response) => (
//             <div className="recommended-products-grid">
//               {response
//                 ? response.products.nodes.map((product) => (
//                     <ProductItem key={product.id} product={product} />
//                   ))
//                 : null}
//             </div>
//           )}
//         </Await>
//       </Suspense>
//       <br />
//     </div>
//   );
// }

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
