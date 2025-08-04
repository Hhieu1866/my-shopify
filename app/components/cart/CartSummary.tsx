import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/cart/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {FetcherWithComponents} from 'react-router';
import {CreditCard, Gift} from 'lucide-react';
import CartDiscounts from './CartDiscounts';
import CartGiftCard from './CartGiftCard';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div className="bg-white px-6 py-8">
      {/* subtotal */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-source text-gray-600">Subtotal</span>
        <span className="font-source font-medium">
          {cart.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>

      {/* discount */}
      <CartDiscounts discountCodes={cart.discountCodes} />

      {/* gift cards */}
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} />

      {/* checkout button */}

      {/* extra information */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2 to-gray-500 text-sm">
          <Gift className="size-4" />
          <span>Complimentary gift wrapping available</span>
        </div>
        <div className="flex items-center gap-2 to-gray-500 text-sm">
          <CreditCard className="size-4" />
          <span>Secure checkout powered by Shopify</span>
        </div>
      </div>
    </div>
  );
}

// function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
//   if (!checkoutUrl) return null;

//   return (
//     <div>
//       <a href={checkoutUrl} target="_self">
//         <p>Continue to Checkout &rarr;</p>
//       </a>
//       <br />
//     </div>
//   );
// }