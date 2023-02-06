import React, { useEffect, useReducer, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdAddCircle } from "react-icons/md";
import EmptyData from "../components/Util/EmptyData";
import Loading from "../components/Util/Loading"

function Delivery({
  id,
  name,
  phone,
  code,
  selected,
  setDelivery,
  setShowDeliveryOrders,
  setShowSetOrders
}) {
  const handleOpenOrders = ()=>{
    setDelivery({
          id,
          name,
          selected,
        });
    setShowDeliveryOrders(true)
  }

  const handleselectOrder = () =>{
    setDelivery({
          id,
          name,
          selected,
        });
    setShowSetOrders(true)
  }
  return (
    <div className="delivery" >
      <div className="delivery_c">
        
        <div className="delivery_data">{name} </div>
        <div className="delivery_data">{code}</div>
        <div className="delivery_data">{phone}</div>
        <div className="delivery_data">
          <button className="delivery_show_orders" onClick={handleOpenOrders}> اظهار الاوردرات</button>
        </div>
        <div className="delivery_data">
          <button className="delivery_data delivery_select_order" onClick={handleselectOrder}> تسليم اوردر للدليفري</button>
        </div>
        
      </div>
    </div>
  );
}

function Order({ id,orderNum, foods, total, selected,selectOrder}) {
  //console.log("Order Data",id,foods,total)
  const [food, dispatchFood] = useReducer(reducer,foods[0]);

  function reducer(state, action) {
    let currentIndex;
  if (action.type === 'next') {
    currentIndex = foods.indexOf(state);
    currentIndex = (currentIndex+1>=foods.length) ? 0 : currentIndex+1;
    return foods[currentIndex]
  } else if (action.type === 'prev') {
    currentIndex = foods.indexOf(state);
    currentIndex = (currentIndex-1<0) ? foods.length-1 : currentIndex-1;
    return foods[currentIndex]
  }
  throw Error('Unknown action.');
}

  return (
    <div className="order" /*onClick={handleClick}*/>
      <div className="order_c">
        <div className="order_id">{orderNum}</div>
        {/* <div className="order_c">
          {customer.firstName} {customer.lastName}
        </div>
        <div className="order_a">
          {adress.countryName} {adress.address}
        </div> */}
        
        <div className="order_item">
          {foods.reduce((a, b) => {
            return a + b.quantity;
          }, 0)}
        </div>
        
        <div className="order_items_details_container">

          <div className="order_item_details">
            <div>{`Item ${foods.indexOf(food)+1} out of ${foods.length}`}</div>
            <div>{food.foodIDs}</div>
            <div>{`count: ${food.quantity}`}</div>
            
          </div>

          <div className="order_items_details_change">
            <p onClick={()=>{dispatchFood({type: "prev"})}}>{"<"}</p>
            <p onClick={()=>{dispatchFood({type: "next"})}}>{">"}</p>
          </div>
        </div>
        <div className="order_total">${total}</div>

        {
          selected === false? (<div className="order_select" onClick={()=>{selectOrder(id)}}>اضافة للدليفري</div>):('')
        }
        
      </div>
  
    </div>
  );
}

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  //const [openDeliveries, setOpenDeliveries] = useState(false);
  const [showDeliveryOrders, setShowDeliveryOrders] = useState(false);
  const [showSetOrders, setShowSetOrders] = useState(false);
  const [delivery, setDelivery] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [unSelectedOrders, setUnSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const handleData = async () => {
    
    try {
      setLoading(true)
      const deliveriesData = await fetch(
        "https://foosfor.guzzall.com/deliveries/",
        {
          method: "GET",
          mode: "cors",
        },
      );

      const jsonDeliveriesData = await deliveriesData.json();
      setDeliveries(jsonDeliveriesData.data);
      //console.log(jsonDeliveriesData);

      const orderData = await fetch("https://foosfor.guzzall.com/delivery/orders", {
        method: "GET",
        mode: "cors",
      });

      //Endpoint Examples OrderData is fetched at the first rendering of the page
      //  const orderData = await fetch("https://foosfor.guzzall.com/delivery/ordersSelected/6361510a259daa5979b7eaed", {
      //    method: "GET",
      //    mode: "cors",
      //  });
      
      // const orderData = await fetch(`https://foosfor.guzzall.com/delivery/selectorders/6361510a259daa5979b7eaed`,
      //   {
      //     method: "POST",
      //     body: JSON.stringify(
      //       {"Oid":"637441e5704f37ec2f2d86bf"}),
      //     mode: "cors",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   },
      // )
      
      const jsonOrderData = await orderData.json();
      setOrders(jsonOrderData.data);
      setLoading(false)
      //console.log("Delivery Data",jsonOrderData);
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  const handleCreate = async (change) => {
    try {
      const deliveriesData = await fetch(
        "https://foosfor.guzzall.com/delivery/createDelivery/634673d9b4020dfeba409f2c",
        {
          method: "POST",
          //body: JSON.stringify(change),
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const jsonDeliveriesData = await deliveriesData.json();
      setDeliveries(jsonDeliveriesData.data);
      //console.log(jsonDeliveriesData);
      window.location.reload();
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  const selectOrderToDeliver = async (orderID)=>{
      let orderData;

      
      //console.log("Selecting Order",delivery.id,orderID)
      await fetch(`https://foosfor.guzzall.com/delivery/selectorders/${delivery.id}`,
        {
          method: "POST",
          body: JSON.stringify(
            {"Oid":orderID}),
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res)=>(res.json())).then((res)=>(orderData=res))
      //console.log("selected Order: ",orderData)

      if(orderData.message === 'done'){
        updateOrders();
        //Closes the select order page and opens selected order page.
        setShowSetOrders(false);
        setShowDeliveryOrders(true);
      }


  }
  //Filters the orders depending on the selected delivery
  // const selectOrders = ()=>{
  //   let selectedOrders = orders.filter(order => order.deliveredBy == delivery.id);
  //   setSelectedOrders(selectedOrders);
  // };


  const updateOrders = async ()=>{
      let selectedOrders;
      setLoading(true)
      await fetch("https://foosfor.guzzall.com/delivery/orders", {
        method: "GET",
        mode: "cors",
      }).then((res)=>(res.json())).then((res)=>selectedOrders = res.data);
      setOrders(selectedOrders)

      await fetch(`https://foosfor.guzzall.com/delivery/ordersSelected/${delivery.id}`, {
         method: "GET",
         mode: "cors",
       }).then((res)=>(res.json())).then((res)=>selectedOrders = res.data.selectedOrders)
      //console.log("selectedOrders: ",selectedOrders)
      setSelectedOrders(selectedOrders)

      let unSelectedOrders = orders.filter(order => order.status === "processing");
      //console.log("selectedOrders: ",unSelectedOrders)
      setUnSelectedOrders(unSelectedOrders);
      setLoading(false)
  }

  useEffect(() => {
    handleData();
  }, []);

  useEffect(() => {
    updateOrders();
  }, [delivery]);

  return (
    <div className="deliveries">
      <div className="deliveries_c">
        <div className="table">
          <div className="table_c">
            
            <div className="delivery_header">الاسم</div>
            <div className="delivery_header">Code</div>
            <div className="delivery_header">التليفون</div>
            <div className="delivery_header">اوردرات الدليفري</div>
            <div className="delivery_header">اضافة اوردر للدليفري</div>
          </div>
        </div>
        <div className="deliveries_container">
          {loading?(<Loading/>):(
            deliveries.length !== 0? (deliveries.map((delivery) => {
            return (
              <Delivery
                key={delivery._id}
                id={delivery._id}
                name={delivery.deliveryName}
                phone={delivery.phone}
                code={delivery.code}
                selected={delivery.selectedOrders}
                setDelivery={setDelivery}
                setShowDeliveryOrders = {setShowDeliveryOrders}
                setShowSetOrders = {setShowSetOrders}
              />
            );
          })):(<EmptyData/>))
          }
        </div>
        <div className="deliveries_add">
          <button onClick={handleCreate}>
            <MdAddCircle />
          </button>
        </div>
      </div>


      {//Template Code for the Sliding menu when clicking on the Delivery Component
      /*delivery.name && (
        <div className={`addDeliveries ${openDeliveries ? "open" : "close"}`}>
          <div className="addDeliveries_c">
            <div className="addDeliveries_col1">
              <p>{delivery.name}</p>
              <button
                className="close"
                onClick={() => setOpenDeliveries(false)}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="addDeliveries_col2">
              <h4>Orders</h4>
              <p>{delivery.selected.length}</p>
            </div>
            <div className="addDeliveries_col3">
              <div className="orders_container_c">
                {selectedOrders.map((order) => {
                  return (
                    <Order
                      key={order._id}
                      id={order._id}
                      orderNum={order.orderNumber}
                      foods={order.foods}
                      total={order.total}
                      //selected={order.deliveredBy === undefined ? false: true}
                      selected={false}
                      selectOrder={selectOrderToDeliver}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
              )*/}

      {delivery.name && showDeliveryOrders?(
        <div className={`addDeliveries ${showDeliveryOrders ? "open" : "close"}`}>
          <div className="addDeliveries_c">
            <div className="addDeliveries_col1">
              <p>{delivery.name}</p>
              <button
                className="close"
                onClick={() => setShowDeliveryOrders(false)}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="addDeliveries_col2">
              <h4>Orders</h4>
              <p>{selectedOrders.length}</p>
            </div>
            <div className="addDeliveries_col3">
              <div className="orders_container_c">
                {loading?(<Loading/>):(selectedOrders.length !==0 ? (
                  selectedOrders.map((order) =>  (
                      <Order
                        key={order._id}
                        id={order._id}
                        orderNum={order.orderNumber}
                        foods={order.foods}
                        total={order.total}
                        selected={true}
                      />))
                    ) : (<EmptyData/>))
                }
              </div>
            </div>
          </div>
        </div>
      ):(0)}


      {delivery.name && showSetOrders ? (
        <div className={`addDeliveries ${showSetOrders ? "open" : "close"}`}>
          <div className="addDeliveries_c">
            <div className="addDeliveries_col1">
              <p>{delivery.name}</p>
              <button
                className="close"
                onClick={() => setShowSetOrders(false)}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="addDeliveries_col2">
              <h4>Orders</h4>
              <p>{unSelectedOrders.length}</p>
            </div>
            <div className="addDeliveries_col3">
              <div className="orders_container_c">
                {loading?(<Loading/>):(unSelectedOrders.length !==0? (unSelectedOrders.map((order) => (
                      <Order
                        key={order._id}
                        id={order._id}
                        orderNum={order.orderNumber}
                        foods={order.foods}
                        total={order.total}
                        selected={false}
                        selectOrder={selectOrderToDeliver}
                      />))
                ) : (<EmptyData/>))
                }
              </div>
            </div>
          </div>
        </div>
      ) : (0)}
    </div>
  );
}

export default Deliveries;
