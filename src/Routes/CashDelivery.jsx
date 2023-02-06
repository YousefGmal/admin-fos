import React, { useEffect, useState } from "react";

function CashDelivery() {
  const [delivery, setDelivery] = useState([]);

  const handleData = async () => {
    try {
      const responed1 = await fetch(
        "https://foosfor.guzzall.com/getOrdersNotArrived/",
        {
          method: "GET",
          mode: "cors",
        }
      );

      const json1 = await responed1.json();
      setDelivery(json1.deliveryfinder);
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  const handleChecked = async (_id) => {
    try {
      await fetch("https://foosfor.guzzall.com/checkArrived/", {
        body: JSON.stringify({
          Did: _id,
        }),
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      handleData();
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <div className="cash">
      <div className="cash_c">
        {delivery.length >= 1 &&
          delivery.map((deliv) => {
            return (
              <div className="cash_c_d_delivery" key={deliv._id}>
                <button type="button" onClick={() => handleChecked(deliv._id)}>
                  وصل
                </button>
                <div className="cash_c_d_id">{deliv._id}</div>
                <div className="cash_c_d_code">{deliv.code}</div>
                <div className="cash_c_d_length">
                  {deliv.selectedOrders.length}
                </div>
                <div className="cash_c_d_name">{deliv.deliveryName}</div>
                <div className="cash_c_d_phone">{deliv.phone}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default CashDelivery;
