import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';
import {Check, Loader2, ShoppingBag} from 'lucide-react';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  afterAddToCart,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  afterAddToCart: () => void;
}) {
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (addedToCart) {
      timeout = setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [addedToCart]);

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => {
        const isLoading = fetcher.state !== 'idle';
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (
            fetcher.state === 'idle' &&
            fetcher.data &&
            !fetcher.data.errors
          ) {
            setAddedToCart(true);
            if (afterAddToCart) {
              afterAddToCart();
            }
          }
        }, [fetcher.state, fetcher.data]);
        return (
          <div className="relative">
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />

            <button
              className={`hover:bg-brand-navyLight relative flex w-full items-center justify-center gap-3 overflow-hidden bg-brand-navy px-8 py-5 font-source text-base tracking-wider text-white transition-all duration-300 ease-in-out before:absolute before:left-0 before:top-0 before:h-full before:w-full before:translate-x-[-100%] before:bg-white/10 before:transition-transform before:duration-700 before:content-[''] hover:before:translate-x-[100%] disabled:cursor-not-allowed disabled:bg-brand-gray disabled:before:hidden`}
              disabled={disabled ?? isLoading}
              onClick={onClick}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span className="font-medium">Adding to Cart</span>
                </>
              ) : addedToCart ? (
                <>
                  <Check className="size-5" />
                  <span className="font-medium">Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-5" />
                  <span className="font-medium">{children}</span>
                </>
              )}
            </button>

            {/* premium loading indicator */}
            {isLoading && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-cream">
                <div className="animate-progress h-full bg-gradient-to-r from-brand-gold to-brand-navy" />
              </div>
            )}
          </div>
        );
      }}
    </CartForm>
  );
}
