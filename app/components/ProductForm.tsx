import {Link, useNavigate} from 'react-router';
import {RichText, type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
  className,
  product,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  className: string;
  product: ProductFragment;
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div className={`product-form ${className}`}>
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5 className="mb-2 font-medium">{option.name}</h5>
            <div className="product-options-grid mb-4 flex gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? 'link' : ''
                      }`}
                      key={option.name + name}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      {/* Status and SKU Display */}
      {selectedVariant && (
        <div className="mb-3 flex justify-between text-sm text-brand-navy/70">
          <div>
            {selectedVariant.availableForSale ? (
              <span>Ready to ship</span>
            ) : (
              <span className="text-red-500">Currently unavailable</span>
            )}
          </div>
          {selectedVariant.sku && (
            <div className="text-right text-brand-navy/60">
              <span className="font-medium">SKU:</span> {selectedVariant.sku}
            </div>
          )}
        </div>
      )}

      {/* Add to cart */}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        afterAddToCart={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>

      {/* product details accordion */}
      <div className="mt-12 border-t border-brand-navy/10">
        <div className="grid grid-cols-1 divide-y divide-brand-navy/10">
          {/* materials section */}
          {product.materials?.value && (
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <h3 className="font-playfair text-lg text-brand-navy">
                  Materials & Construction
                </h3>
                <span className="relative ml-4 size-4 flex-shrink-0">
                  <svg
                    className="absolute inset-0 h-4 w-4 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <div className="prose pt-4 font-source text-brand-navy/80">
                <RichText data={product.materials.value} />
                {product.construction?.value && (
                  <div className="mt-4">
                    <h4 className="font-playfair text-base text-brand-navy">
                      Construction
                    </h4>
                    <p>{product.construction.value}</p>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* size and fit section */}
          {product.sizingNotes?.value && (
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <h3 className="font-playfair text-lg text-brand-navy">
                  Size & Fit
                </h3>
                <span className="relative ml-4 size-4 flex-shrink-0">
                  <svg
                    className="absolute inset-0 h-4 w-4 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <div className="prose pt-4 font-source text-brand-navy/80">
                <p>{product.sizingNotes.value}</p>
              </div>
            </details>
          )}

          {/* care instructions */}
          {product.careInstructions?.value && (
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <h3 className="font-playfair text-lg text-brand-navy">
                  Care Guide
                </h3>
                <span className="relative ml-4 size-4 flex-shrink-0">
                  <svg
                    className="absolute inset-0 h-4 w-4 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <div className="prose pt-4 font-source text-brand-navy/80">
                <RichText data={product.careInstructions.value} />
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
