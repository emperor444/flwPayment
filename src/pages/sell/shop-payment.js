import { useState } from "react";
import { useLocation } from "react-router-dom";
import { updatePendingShop } from "../../api/shop";
import { history } from "../../App";
import loginImg from "../../assets/images/loginImg.jpg";
import { CardPayment, Dialog, Error } from "../../components";

export default function ShopPayment() {
  const location = useLocation();
  const shop = location.state && location.state.payload;
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const updateShop = async () => {
    let payload = { shopId: shop.shopId, dispatcherId: shop.dispatcherId };
    try {
      const res = await updatePendingShop(payload);
      if (res.err) {
        setError(res.err ? res.err : "Something went wrong");
      } else {
        setStatus("success");
      }
    } catch (error) {
      setError(error.toString());
    }
    setShow(true);
  };
  return (
    <div className="relative h-screen w-full">
      {show ? (
        status === "success" ? (
          <Dialog
            state="success"
            title="Payment successful"
            message={`
        Your shop "${shop.title}" was successfully created, You've been
        assigned "${shop.dispatcher.fullname} (${shop.dispatcher.phoneNumber})" as your dispatch rider.\n
        You can start selling by adding products to your shop.
        `}
            callbackText="Start selling"
            callback={() => {
              // history.push(`/shop/${shop.shopId}/add-product`);
              history.replace("/");
            }}
          />
        ) : (
          <Dialog
            state="failed"
            title="Payment failed"
            message={`${
              error ? error : "Something went wrong, could not process payment"
            }`}
            callbackText="Try again"
            cancel={() => {
              setShow(false);
              setStatus("");
            }}
            callback={() => {
              setShow(false);
              setStatus("");
            }}
          />
        )
      ) : null}
      {!shop && <Error />}
      {shop && (
        <div>
          <div className="hidden sm:block w-1/2 h-full">
            <div
              className="h-full bg-no-repeat bg-center bg-cover"
              style={{ backgroundImage: `url(${loginImg})` }}
            ></div>
          </div>
          <CardPayment
            label="Create Store"
            note="You'll be charged a token of $20 to create a store"
            amount={20}
            currency="USD"
            onPaymentFailed={(response) => {
              console.log(response, "FAILED");
              setShow(true);
              setError("Error");
              setStatus("failed");
            }}
            onPaymentSuccess={(response) => {
              updateShop(response);
            }}
          />
        </div>
      )}
    </div>
  );
}
