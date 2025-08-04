// CartMain.tsx: Hiển thị danh sách sản phẩm trong giỏ hàng và phần tổng kết, dùng cho cả trang chính và sidebar.

import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLineItem} from '~/components/cart/CartLineItem';
import {CartSummary} from './CartSummary';
import CartEmpty from './CartEmpty';

// Định nghĩa kiểu cho layout giỏ hàng: hiển thị toàn trang (page) hoặc dạng aside/sidebar
export type CartLayout = 'page' | 'aside';

// Props truyền vào CartMain component
export type CartMainProps = {
  cart: CartApiQueryFragment | null; // Dữ liệu giỏ hàng trả về từ Storefront API
  layout: CartLayout; // Kiểu giao diện hiển thị
};

/**
 * Component chính hiển thị nội dung giỏ hàng: danh sách sản phẩm và phần tổng kết.
 * Dùng ở cả trang /cart (page) và hộp thoại aside (sidebar).
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // Hook xử lý optimistic UI: cho phép hiển thị ngay các thay đổi (add/update/remove)
  const cart = useOptimisticCart(originalCart);

  // Kiểm tra giỏ hàng có item nào không
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);

  // Kiểm tra có áp dụng mã giảm giá hay không
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);

  // Gán class CSS nếu có mã giảm giá
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  // Kiểm tra tổng số lượng sản phẩm trong giỏ có > 0 hay không
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      {/* Component hiển thị trạng thái giỏ hàng trống (nếu không có sản phẩm) */}
      <CartEmpty hidden={linesCount} layout={layout} />

      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul>
            {/* Duyệt qua từng dòng sản phẩm trong giỏ hàng */}
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem
                key={line.id}
                line={line} // Truyền dữ liệu dòng sản phẩm (sản phẩm, số lượng,...)
                layout={layout} // Dạng hiển thị (page hoặc aside)
              />
            ))}
          </ul>
        </div>

        {/* Nếu giỏ có sản phẩm thì hiển thị phần tổng kết (tổng tiền, thuế, v.v.) */}
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}
