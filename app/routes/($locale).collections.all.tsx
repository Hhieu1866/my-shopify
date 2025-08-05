import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import ProductItem from '~/components/ProductItem';
import {ArrowRight} from 'lucide-react';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | Products`}];
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
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="collection">
      {/* hero section */}
      <section className="relative h-[80vh] min-h-[600px] bg-brand-navy">
        <div className="absolute inset-0">
          <Image
            alt="Craftsmanship"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            data={{
              url: '/public/images/craftsman.png',
              width: 1920,
              height: 1080,
            }}
            className="absolute inset-0 size-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/50 to-brand-navy/80"></div>
        </div>

        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl">
            <h1 className="mb-6 font-playfair text-4xl text-white md:text-6xl">
              Artisanal Excellence
            </h1>
            <p className="mb-8 max-w-xl font-source text-lg text-gray-200">
              Each ELOWEN piece embodies the pinnacle of shoemaking craft, where
              time-honored techniques meet contemporary sophistication
            </p>
          </div>
        </div>
      </section>

      {/* collection navigation */}
      <section className="border-y border-brand-navy/10 bg-brand-cream">
        <div className="container mx-auto">
          <div className="flex flex-col items-start justify-between gap-4 px-4 py-8 md:flex-row md:items-center">
            <div className="space-y-2">
              <h2 className="font-playfair text-2xl text-brand-navy">
                The Collection
              </h2>
              <p className="font-source text-brand-navy/60">
                Showing {products.nodes.length} handcrafted pieces
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button className="font-source text-sm text-brand-navy/60 transition-colors hover:text-brand-navy">
                Filter
              </button>
              <button className="font-source text-sm text-brand-navy/60 transition-colors hover:text-brand-navy">
                Sort
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* products grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16"
          >
            {({node: product}: {node: ProductItemFragment}) => (
              <ProductItem key={product.id} product={product} loading="lazy" />
            )}
          </PaginatedResourceSection>
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Temporibus omnis officiis quidem eveniet, consequuntur
                necessitatibus culpa reiciendis soluta officia? Numquam.
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

      {/* heritage banner */}
      <section className="bg-brand-cream py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="mb-6 font-playfair text-2xl text-brand-navy md:text-3xl">
              A Legacy of Distinction
            </h3>
            <p className="mb-4 font-source text-brand-navy/80">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Asperiores perspiciatis cupiditate ipsam. Accusamus aspernatur
              similique saepe nisi corporis atque nulla!
            </p>
            <p className="mb-4 font-source text-sm text-brand-navy/60">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 10) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
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
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
