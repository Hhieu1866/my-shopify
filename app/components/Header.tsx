import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {SearchIcon, ShoppingBag, User} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {type: asideType} = useAside();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      '--announcement-height',
      isScrolled ? '0px' : '40px',
    );
    root.style.setProperty('--header-height', isScrolled ? '64px' : '80px');

    const handleScroll = () => {
      if (asideType !== 'closed') return;

      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);

      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isScrolled, asideType]);

  return (
    <div
      className={`fixed z-40 w-full transition-transform duration-500 ease-in-out ${!isScrollingUp && isScrolled && asideType === 'closed' ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div
        className={`overflow-hidden bg-brand-navy text-white transition-all duration-500 ease-in-out ${isScrolled ? 'max-h-0' : 'max-h-12'}`}
      >
        <div className="container mx-auto px-4 py-2 text-center">
          <p className="font-source text-[13px] font-medium leading-tight tracking-wider sm:text-sm">
            Complimentary Shipping on Orders Above $500
          </p>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`border-b transition-all duration-500 ease-in-out ${isScrolled ? 'border-transparent bg-white/80 shadow-sm backdrop-blur-lg' : 'border-gray-100 bg-white'}`}
      >
        <div className="container mx-auto">
          {/* Mobile logo */}
          <div
            className={`hidden border-b border-gray-100 text-center transition-all duration-300 ease-in-out max-[550px]:block ${isScrolled ? 'py-1' : 'py-2'}`}
          >
            <NavLink
              prefetch="intent"
              to="/"
              className="inline-block font-playfair text-2xl tracking-normal"
            >
              <h1 className="my-0 font-medium">HTH</h1>
            </NavLink>
          </div>

          {/* Header content */}
          <div
            className={`flex items-center justify-between px-4 transition-all duration-300 ease-in-out sm:px-6 ${isScrolled ? 'py-3 sm:py-4' : 'py-4 sm:py-6'}`}
          >
            {/* Mobile menu toggle */}
            <div className="lg:hidden">
              <HeaderMenuMobileToggle />
            </div>

            {/* Logo */}
            <NavLink
              prefetch="intent"
              to="/"
              className={`${isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[20px]'} absolute left-1/2 -translate-x-1/2 text-center font-playfair tracking-wider transition-all duration-300 ease-in-out max-[550px]:hidden lg:static lg:translate-x-0 lg:text-left`}
            >
              <h1 className="font-medium uppercase">Elowen</h1>
            </NavLink>

            {/* Desktop navigation */}
            <div className="flex-1-px-12 hidden lg:block">
              {/* 
                HeaderMenu component - Render navigation menu cho desktop
                Props:
                - menu: Dữ liệu menu từ Shopify Storefront API (chứa các menu items)
                - viewport: "desktop" - Chỉ định đây là menu cho desktop view
                - primaryDomainUrl: URL chính của shop (dùng để xử lý internal/external links)
                - publicStoreDomain: Domain công khai của store (dùng để validate URLs)
              */}
              <HeaderMenu
                menu={menu}
                viewport="desktop"
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              ></HeaderMenu>
            </div>

            {/* CTAS */}
            <div className="flex items-center">
              <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  // Lấy function close từ useAside hook để đóng aside/sidebar khi click vào menu item
  const {close} = useAside();

  const baseClassName =
    'transition-all duration-200 hover:text-brand-gold font-source relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full';
  const desktopClassName =
    'flex items-center justify-center space-x-12 text-sm uppercase tracking-wider';
  const mobileClassName = 'flex flex-col px-6';

  if (!menu) {
    return null;
  }

  return (
    <nav
      className={viewport === 'desktop' ? desktopClassName : mobileClassName}
      role="navigation"
    >
      {viewport === 'mobile' && (
        <>
          {/* mobile navigation links */}
          <div className="space-y-6 py-4">
            {menu?.items.map((item) => {
              if (!item.url) return null;
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) || // hoanghieu.com/collections
                item.url.includes(primaryDomainUrl) // store.hoanghieu.com/collections
                  ? new URL(item.url).pathname // --> /collections
                  : item.url; // google.com
              return (
                <NavLink
                  key={item.id}
                  onClick={close}
                  prefetch="intent"
                  to={url}
                  end // product/boot --> products NOT ACTIVE
                  className={({isActive}) =>
                    `${baseClassName} block py-2 ${isActive ? 'text-brand-gold' : 'text-brand-navy'}`
                  }
                >
                  {item.title}
                </NavLink>
              );
            })}
          </div>

          {/* mobile footer links */}
          <div className="mt-auto border-t border-gray-100 py-6">
            <div className="space-y-4">
              <NavLink
                to="/account"
                className="flex items-center space-x-2 text-brand-navy hover:text-brand-gold"
              >
                <User className="size-5" />
                <span className="font-source text-base">Account</span>
              </NavLink>

              <button
                className="flex w-full items-center space-x-2 text-left text-brand-navy hover:text-brand-gold"
                onClick={() => {
                  close();
                  // todo search logic
                }}
              >
                <SearchIcon className="size-5" />
                <span className="font-source text-base">Search</span>
              </button>
            </div>
          </div>
        </>
      )}

      {viewport === 'desktop' &&
        //desktop menu
        menu?.items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) || // hoanghieu.com/collections
            item.url.includes(primaryDomainUrl) // store.hoanghieu.com/collections
              ? new URL(item.url).pathname // --> /collections
              : item.url; // google.com

          return (
            <NavLink
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
              end // product/boot --> products NOT ACTIVE
              className={({isActive}) =>
                `${baseClassName} text-[15px] ${isActive ? 'text-brand-gold' : 'text-brand-navy'}`
              }
            >
              {item.title}
            </NavLink>
          );
        })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center space-x-2 sm:space-x-3 lg:space-x-5">
      <SearchToggle />

      <NavLink
        to="/account"
        prefetch="intent"
        className="relative p-2 transition-all duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-0 after:-translate-x-1/2 after:bg-brand-gold after:transition-all after:duration-300 after:content-[''] hover:text-brand-gold hover:after:w-full"
      >
        <span className="sr-only">Account</span>
        <User className="size-5" />
      </NavLink>

      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      onClick={() => open('search')}
      className="relative p-2 transition-all duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-0 after:-translate-x-1/2 after:bg-brand-gold after:transition-all after:duration-300 after:content-[''] hover:text-brand-gold hover:after:w-full"
    >
      <SearchIcon className="size-5" />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="relative p-2 transition-all duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-0 after:-translate-x-1/2 after:bg-brand-gold after:transition-all after:duration-300 after:content-[''] hover:text-brand-gold hover:after:w-full"
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <ShoppingBag className="size-5" />
      {count !== null && count > 0 && (
        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-brand-gold text-[10px] font-medium text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

// const FALLBACK_HEADER_MENU = {
//   id: 'gid://shopify/Menu/199655587896',
//   items: [
//     {
//       id: 'gid://shopify/MenuItem/461609500728',
//       resourceId: null,
//       tags: [],
//       title: 'Collections',
//       type: 'HTTP',
//       url: '/collections',
//       items: [],
//     },
//     {
//       id: 'gid://shopify/MenuItem/461609533496',
//       resourceId: null,
//       tags: [],
//       title: 'Blog',
//       type: 'HTTP',
//       url: '/blogs/journal',
//       items: [],
//     },
//     {
//       id: 'gid://shopify/MenuItem/461609566264',
//       resourceId: null,
//       tags: [],
//       title: 'Policies',
//       type: 'HTTP',
//       url: '/policies',
//       items: [],
//     },
//     {
//       id: 'gid://shopify/MenuItem/461609599032',
//       resourceId: 'gid://shopify/Page/92591030328',
//       tags: [],
//       title: 'About',
//       type: 'PAGE',
//       url: '/pages/about',
//       items: [],
//     },
//   ],
// };

// function activeLinkStyle({
//   isActive,
//   isPending,
// }: {
//   isActive: boolean;
//   isPending: boolean;
// }) {
//   return {
//     fontWeight: isActive ? 'bold' : undefined,
//     color: isPending ? 'grey' : 'black',
//   };
// }
