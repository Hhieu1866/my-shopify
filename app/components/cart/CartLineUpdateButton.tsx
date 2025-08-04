import {CartForm} from '@shopify/hydrogen';
import {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {Loader2} from 'lucide-react';
import {useEffect, useState} from 'react';

type CartLineUpdateButtonProps = {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
};

// Create a separate component for the form content
const FormContent = ({
  fetcher,
  children,
}: {
  fetcher: any;
  children: React.ReactNode;
}) => {
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (fetcher.state === 'loading') {
      setUpdating(true);
    } else if (fetcher.state === 'idle') {
      setTimeout(() => setUpdating(false), 200);
    }
  }, [fetcher.state]);

  if (updating) {
    return (
      <div className="relative inline-flex items-center justify-center">
        <div className="pointer-events-none opacity-50">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="size-4 animate-spin text-brand-gold" />
        </div>
      </div>
    );
  }
  return children;
};

const CartLineUpdateButton = ({lines, children}: CartLineUpdateButtonProps) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {(fetcher) => <FormContent fetcher={fetcher}>{children}</FormContent>}
    </CartForm>
  );
};

export default CartLineUpdateButton;
