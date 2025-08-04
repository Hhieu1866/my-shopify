import {ArrowRight, ShoppingBag} from 'lucide-react';
import {useAside} from '../Aside';
import {CartMainProps} from './CartMain';
import {Link} from 'react-router';

const CartEmpty = ({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) => {
  const {close} = useAside();

  if (hidden) {
    return null;
  }

  return (
    <div
      className={`flex h-full flex-col items-center justify-center p-6 text-center`}
    >
      {/* icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 scale-[1.8] rounded-full bg-brand-cream opacity-50 blur-xl" />
        <div className="relative flex size-20 items-center justify-center rounded-full bg-brand-cream">
          <ShoppingBag className="size-8 text-brand-navy" />
        </div>
      </div>

      {/* content */}
      <div className="max-w-md space-y-4">
        <h2 className="font-playfair text-2xl text-brand-navy">
          Your Shopping Cart is Empty
        </h2>
        <p className="font-source leading-relaxed text-gray-500">
          Discover our collection of handcrafted footwear, where traditional
          artisanship meets contemporary elegance.
        </p>
      </div>

      {/* primary CTA */}
      <Link
        to="/collections/all"
        onClick={close}
        prefetch="intent"
        className="hover:bg-brand-navyLight mt-6 inline-flex items-center justify-center bg-brand-navy px-8 py-4 font-source font-medium text-white transition-all duration-300"
      >
        Explore Out Products
        <ArrowRight className="ml-2 size-5" />
      </Link>

      {/* collections/all CTA */}
      <div className="mt-8 space-y-3 border-t border-gray-100 pt-8">
        <p className="font-source text-sm uppercase tracking-wide text-gray-400">
          Featured Products
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link
            to="/collections/all"
            onClick={close}
            prefetch="intent"
            className="hover:text-brand-goldDark text-brand-gold transition-colors duration-300"
          >
            View All
          </Link>
        </div>
      </div>

      {/* contact information */}
      <div className="pt-6 text-sm text-gray-500">
        <p className="font-source">Need assistance? Contact our atelier</p>
        <a
          href="mailto:hieuuhtwork@gmail.com"
          className="hover:text-brand-goldDark font-source text-brand-gold transition-colors duration-300"
        >
          hieuuhtwork@gmail.com
        </a>
      </div>
    </div>
  );
};

export default CartEmpty;
