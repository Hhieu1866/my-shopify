import {CartForm} from '@shopify/hydrogen';
import {X} from 'lucide-react';
import React from 'react';

type CartLineRemoveButtonProps = {
  lineIds: string[];
  disabled: boolean;
};

const CartLineRemoveButton = ({
  lineIds,
  disabled,
}: CartLineRemoveButtonProps) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        className={`ml-3 text-gray-400 transition-colors hover:text-gray-500 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={disabled}
      >
        <X className="size-4" />
      </button>
    </CartForm>
  );
};

export default CartLineRemoveButton;
