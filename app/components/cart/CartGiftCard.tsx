import {CartForm} from '@shopify/hydrogen';
import {Loader2, Ticket} from 'lucide-react';
import React, {useRef, useState} from 'react';
import {FetcherWithComponents} from 'react-router';
import {CartApiQueryFragment} from 'storefrontapi.generated';

const CartGiftCard = ({
  giftCardCodes,
}: {
  giftCardCodes?: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const appliedGiftCardCodes = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `•••• ${lastCharacters}`) || [];

  const saveAppliedCode = (code: string) => {
    if (!inputRef.current) {
      return;
    }

    const formattedCode = code.replace(/\s/g, '');
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    inputRef.current.value = '';
    setShowInput(false);
  };

  return (
    <div className="border-t border-gray-100 py-4">
      {/* applied discounts */}
      {codes.length > 0 ? <div></div> : ''}

      {/* discount input */}
      {showInput ? (
        <UpdateGiftCardForm
          giftCardCodes={appliedGiftCardCodes.current}
          saveAppliedCode={saveAppliedCode}
        >
          {(fetcher) => {
            const isLoading = fetcher.state !== 'idle';
            return (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    name="giftCardCode"
                    placeholder="Enter gift card code"
                    className="w-full rounded border border-gray-200 px-3 py-2 font-source text-sm focus:border-brand-navy focus:outline-none"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Loader2 className="size-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    className={`rounded bg-brand-navy px-4 py-2 font-source text-sm text-white transition-colors duration-300 ${
                      isLoading
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-brand-navyLight'
                    } `}
                    type="submit"
                  >
                    Apply
                  </button>
                  <button
                    className="rounded border-gray-200 px-4 py-2 font-source text-sm transition-colors duration-300 hover:border-gray-300"
                    onClick={() => setShowInput(false)}
                    type="button"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }}
        </UpdateGiftCardForm>
      ) : (
        <button
          className="hover:text-brand-goldDark inline-flex items-center gap-2 font-source text-sm text-brand-gold transition-colors"
          onClick={() => setShowInput(true)}
        >
          <Ticket className="size-4" />
          Add Gift Card
        </button>
      )}
    </div>
  );
};

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode | ((fetcher: any) => React.ReactNode);
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return typeof children === 'function' ? children(fetcher) : children;
      }}
    </CartForm>
  );
}

export default CartGiftCard;
