import {CartForm} from '@shopify/hydrogen'; // Component đặc biệt từ Hydrogen để thao tác với giỏ hàng (form chuẩn)
import {Loader2, Ticket} from 'lucide-react'; // Icon SVG từ thư viện lucide-react
import {useRef, useState} from 'react'; // Hook React
import {FetcherWithComponents} from 'react-router'; // Được dùng để kiểm tra trạng thái fetch khi submit form
import {CartApiQueryFragment} from 'storefrontapi.generated'; // Kiểu dữ liệu lấy từ GraphQL query của Shopify

// Component chính: Giao diện nhập & hiển thị mã giảm giá
const CartDiscounts = ({
  discountCodes, // Prop nhận từ parent component – danh sách mã giảm giá đang có
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) => {
  const [showInput, setShowInput] = useState<boolean>(false); // Toggle hiển thị input nhập mã
  const inputRef = useRef<HTMLInputElement>(null); // Dùng để focus hoặc thao tác DOM với input

  // Lọc ra những mã đang được áp dụng (applicable), lấy ra chuỗi code
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="border-t border-gray-100 py-4">
      {/* Nếu có mã giảm giá đang áp dụng → có thể render ra danh sách */}
      {codes.length > 0 ? <div></div> : ''}

      {/* Nếu đang mở ô nhập mã */}
      {showInput ? (
        // Bọc trong <CartForm> của Hydrogen với hành động cập nhật mã giảm giá
        <UpdateDiscountForm discountCodes={codes}>
          {(fetcher) => {
            const isLoading = fetcher.state !== 'idle'; // Khi đang gửi form

            return (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  {/* Input nhập mã */}
                  <input
                    ref={inputRef}
                    type="text"
                    name="discountCode" // Tên field gửi về
                    placeholder="Enter promo code"
                    className="w-full rounded border border-gray-200 px-3 py-2 font-source text-sm focus:border-brand-navy focus:outline-none"
                    disabled={isLoading}
                  />

                  {/* icon loading */}
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
                    onClick={() => setShowInput(false)} // Ẩn input nếu nhấn Cancel
                    type="button"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }}
        </UpdateDiscountForm>
      ) : (
        // Nếu chưa hiển thị input -> chỉ hiện nút "Add Promo Code"
        <button
          className="hover:text-brand-goldDark inline-flex items-center gap-2 font-source text-sm text-brand-gold transition-colors"
          onClick={() => setShowInput(true)}
        >
          <Ticket className="size-4" />
          Add Promo Code
        </button>
      )}
    </div>
  );
};

// Component bọc form cập nhật discount code, dùng CartForm đặc biệt của Shopify Hydrogen
function UpdateDiscountForm({
  discountCodes,
  children, // Render props – hàm nhận fetcher (dùng để biết trạng thái loading)
}: {
  discountCodes?: string[];
  children:
    | React.ReactNode
    | ((fetcher: FetcherWithComponents<any>) => React.ReactNode);
}) {
  return (
    <CartForm
      route="/cart" // Route xử lý action
      action={CartForm.ACTIONS.DiscountCodesUpdate} // Cập nhật mã giảm giá
      inputs={{
        discountCodes: discountCodes || [], // Gửi danh sách mã hiện tại kèm theo
      }}
    >
      {children}
    </CartForm>
  );
}

export default CartDiscounts;
