import {Suspense} from 'react';
import {Await, Form, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-brand-navy text-white">
            {/* newsletter signup section */}
            <div className="border-b border-white/10">
              <div className="container mx-auto px-4 py-12">
                <div className="mx-auto max-w-xl text-center">
                  <h2 className="mb-4 font-playfair text-2xl">
                    Join the Artisans Circle
                  </h2>
                  <p className="mb-6 font-source text-sm text-gray-300">
                    Subscribe to receive updates on new collections,
                    craftsmanship insights, and exclusive offers.
                  </p>
                  <Form className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="flex-1 rounded-md border-white/20 bg-white/10 px-4 py-3 font-source text-white placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-brand-gold px-6 py-3 font-source text-sm font-medium text-white transition-colors duration-300 hover:bg-brand-goldDark"
                    >
                      Subscribe
                    </button>
                  </Form>
                </div>
              </div>
            </div>

            {/* main footer content */}
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                {/* brand column */}
                <div className="space-y-6">
                  <h3 className="font-playfair text-2xl">ELOWEN</h3>
                  <p className="font-source text-sm text-gray-300 leading-relaxed">
                    Artisanal footwear for the modern sophisticate. Crafted with precision, designed for distinction
                  </p>
                </div>

                {/* contact column */}

                {/* quick links column */}

                {/* policies column */}
              </div>
            </div>

            {/* copyright bar */}
            <div className="border-t border-white/10">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-5">
                  <p className="font-source text-sm text-gray-400">
                    © {new Date().getFullYear()} Elowen. All rights reserved.
                  </p>
                  <p className="font-source text-sm text-gray-400">
                    Crafted with passion in VietNam
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
