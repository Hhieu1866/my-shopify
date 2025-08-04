import {OptimisticCartLine} from '@shopify/hydrogen';
import {CartApiQueryFragment} from 'storefrontapi.generated';
import CartLineUpdateButton from './CartLineUpdateButton';
import CartLineRemoveButton from './CartLineRemoveButton';
import {Minus, Plus} from 'lucide-react';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

type CartLineQuantityAdjustorProps = {
  line: CartLine;
};
const CartLineQuantityAdjustor = ({line}: CartLineQuantityAdjustorProps) => {
  if (!line || typeof line.quantity === 'undefined') {
    return null;
  }

  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number(Math.round(quantity) + 1);

  return (
    <div className="flex items-center gap-2">
      <CartLineUpdateButton
        lines={[
          // Cập nhật lại thông tin dòng sản phẩm trong giỏ
          {
            id: lineId, // ID dòng sản phẩm cần cập nhật
            quantity: prevQuantity, // Số lượng mới muốn set
          },
        ]}
      >
        <button
          disabled={quantity <= 1}
          className={`flex size-8 items-center justify-center rounded border transition-colors ${
            quantity <= 1
              ? 'border-gray-200 text-gray-300'
              : 'border-gray-200 text-gray-500 hover:border-gray-400'
          }`}
        >
          <Minus className="size-4" />
        </button>
      </CartLineUpdateButton>

      <span className="w-8 text-center font-source">{quantity}</span>

      <CartLineUpdateButton
        lines={[
          {
            id: lineId,
            quantity: nextQuantity,
          },
        ]}
      >
        <button
          className={`flex size-8 items-center justify-center rounded border border-gray-200 text-gray-500 transition-colors hover:border-gray-400`}
        >
          <Plus className="size-4" />
        </button>
      </CartLineUpdateButton>

      <CartLineRemoveButton
        lineIds={[lineId]} // ID dòng sản phẩm trong giỏ
        disabled={isOptimistic === true} // true: đang xử lý xóa, disable nút
      />
    </div>
  );
};

export default CartLineQuantityAdjustor;
