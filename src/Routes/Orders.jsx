import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import EmptyData from "../components/Util/EmptyData";
import Loading from "../components/Util/Loading";
const st =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZGQ2MjI5NWQwOWFiNDQzOTliMDFlMyIsImlzbG9nZ2VkIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU0NTMxNzh9.ftDyy54zr54beRpqtWZ7tdN2dw1M_yYzjO9BhUb9Zv4";

function Order({
  id,
  orderNumber,
  customer,
  adress,
  items,
  total,
  setOrder,
  setOpenOrders,
  setChangeOrderId,
}) {
  const handleClick = () => {
    setOrder({
      id,
      address: `${adress.countryName} ${adress.address}`,
      items,
      total,
      orderNumber,
    });
    setOpenOrders(true);
    setChangeOrderId(orderNumber);
  };

  return (
    <div className="order" onClick={handleClick}>
      <div className="order_c">
        <div className="order_id">{orderNumber}</div>
        <div className="order_c">
          {customer.userName}
        </div>
        <div className="order_a">
          {adress.countryName} {adress.address} 
        </div>
        <div className="order_item">
          {items.reduce((a, b) => {
            return a + b.quantity;
          }, 0)}
        </div>
        <div className="order_total">${total}</div>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({});
  const [openOrders, setOpenOrders] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changeOrderId, setChangeOrderId] = useState("");
  const [changeOrderState, setChangeOrderState] = useState(true);

  const handleData = async () => {
    try {
      const responed = await fetch("http://153.92.209.101:3000/getOrders/", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: st,
        },
      });

      const json = await responed.json();
      setOrders(json.order);
      setLoading(false);
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  const acceptOrder = async () => {
    let acceptResponse;
    await fetch(`http://153.92.209.101:3000/acceptorder/${order.id}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: st,
      },
    })
      .then((res) => res.json())
      .then((res) => (acceptResponse = res));

    setLoading(true);
    if (acceptResponse.message === "done") {
      await fetch("http://153.92.209.101:3000/getOrders/", {
        method: "GET",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((res) => setOrders(res.order));
      setLoading(false);
      setOpenOrders(false);
    }
  };

  const onClickOrder = async () => {
    if (changeOrderState) {
      setChangeOrderState(false);
      setChangeOrderId(order.orderNumber);
    } else {
      try {
        await fetch("http://153.92.209.101:3000/editOrderNumber/", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            orderNumber: +changeOrderId,
            Oid: order.id,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: st,
          },
        });
        setChangeOrderState(true);
        await handleData();
      } catch {
        console.error("Failed To Get The Data!");
      }
    }
  };

  const onOrderChange = (e) => {
    if (e.target.value.slice(e.target.value.length - 1).match(/[0-9]/)) {
      setChangeOrderId(e.target.value);
    } else if (e.target.value === "") {
      setChangeOrderId("");
    } else {
      setChangeOrderId(changeOrderId);
    }
  };

  useEffect(() => {
    setLoading(true);
    handleData();

    setInterval(() => {
      handleData();
    }, 60000);
  }, []);

  return (
    <div className="orders">
      <div className="orders_c">
        <div className="table">
          <div className="table_c">
            <div className="order_id">الطلب</div>
            <div className="order_c">اسم العميل</div>
            <div className="order_a">العنوان</div>
            <div className="order_item">العناصر</div>
            <div className="order_total">السعر</div>
          </div>
        </div>
        <div className="orders_container">
          {loading ? (
            <Loading />
          ) : orders.length != 0 ? (
            orders.map((order) => {
              return (
                <Order
                  key={order._id}
                  id={order._id}
                  orderNumber={order.orderNumber}
                  customer={order.orderedBy}
                  adress={order.shipAddress}
                  items={order.foods}
                  total={order.total}
                  setOrder={setOrder}
                  setOpenOrders={setOpenOrders}
                  setChangeOrderId={setChangeOrderId}
                />
              );
            })
          ) : (
            <EmptyData />
          )}
        </div>
      </div>
      {order.total && (
        <div className={`order_slide ${openOrders ? "open" : "close"}`}>
          <div className="order_slide_c">
            <div className="order_slide_col1">
              <p>الطلب</p>
              <div className="">
                <input
                  type="text"
                  disabled={changeOrderState}
                  onChange={onOrderChange}
                  value={changeOrderId}
                />
                <button type="button" onClick={onClickOrder}>
                  {changeOrderState ? "تعديل" : "حفظ"}
                </button>
              </div>
              <button className="close" onClick={() => setOpenOrders(false)}>
                <AiOutlineClose />
              </button>
            </div>
            <div className="order_slide_col2">
              <h4>العنوان</h4>
              <p>{order.address}</p>
            </div>
            <div className="order_slide_col3">
              <h4>العناصر</h4>
              <div className="order_slide_col3_tabel">
                <div className="order_slide_col3_tabel_c">
                  <div className="unit_name">اسم الاكل</div>
                  <div className="unit_price">السعر</div>
                  <div className="unit_quantity">الكمية</div>
                  <div className="unit_total">السعر الكلي</div>
                </div>
              </div>
              {order.items.map((item) => {
                return (
                  <div className="order_slide_col3_items" key={item._id}>
                    <div className="order_slide_col3_items_c">
                      <div className="unit_name">{item.foodIDs}</div>
                      <div className="unit_price">{item.price}</div>
                      <div className="unit_quantity">{item.quantity}</div>
                      <div className="unit_total">
                        ${item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="order_slide_col4">
              <h3>السعر شامل التوصيل</h3>
              <p>${order.total}</p>
            </div>
            <div className="order_slide_col5">
              <button className="btn_delete_order" onClick={acceptOrder}>
                قبول
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
