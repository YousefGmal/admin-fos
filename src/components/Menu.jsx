import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAttachMoney } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FiUsers } from "react-icons/fi";
import { BiCategory, BiHomeAlt } from "react-icons/bi";

const st =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZGQ2MjI5NWQwOWFiNDQzOTliMDFlMyIsImlzbG9nZ2VkIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU0NTMxNzh9.ftDyy54zr54beRpqtWZ7tdN2dw1M_yYzjO9BhUb9Zv4";

function Menu() {
  const navigate = useNavigate(null);
  const [close, setClose] = useState(false);
  const ref = useRef();
  const ref1 = useRef();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleReset = async () => {
    try {
      const respond = await fetch("http://153.92.209.101:3000/resetcounter", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: st,
        },
      });
      if (respond.ok) {
        ref.current.style.display = "flex";
      }
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  const handleClose = async () => {
    try {
      const respond = await fetch("http://153.92.209.101:3000/closeapp", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: st,
        },
      });
      if (respond.ok) {
        ref1.current.style.display = "flex";
      }
      setClose(!close);
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  const getClose = async () => {
    try {
      const respond = await fetch("http://153.92.209.101:3000/closeappvalue", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: st,
        },
      });
      const result = await respond.json();
      setClose(result.data);
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  useEffect(() => {
    getClose();
  }, [close]);

  return (
    <nav className="menu">
      <div
        className="reset_done"
        ref={ref}
        onClick={(e) => (e.currentTarget.style.display = "none")}
      >
        <div className="reset_done_c">
          <p>
            <IoMdDoneAll />
            <span>رقم الطلب : 1</span>
          </p>
        </div>
      </div>
      <div
        className="close_app"
        ref={ref1}
        onClick={(e) => (e.currentTarget.style.display = "none")}
      >
        <div className="close_app_c">
          <p>
            <IoMdDoneAll />
            {close ? <span>تم اغلاق التطبيق</span> : <span>تم فتح التطبيق</span>}
          </p>
        </div>
      </div>
      <h3>مطعم فسفور</h3>
      <ul>
        <li onClick={() => handleNavigate("ordars")}>
          <MdAttachMoney />
          <span>الطلبات</span>
        </li>
        <li onClick={() => handleNavigate("users")}>
          <FiUsers />
          <span>العملاء</span>
        </li>
        {/* { <li onClick={() => handleNavigate("deliveries")}>
          <FiUsers />
          <span>الدليفري</span>
        </li>
        <li onClick={() => handleNavigate("categories")}>
          <BiCategory />
          <span>الاصناف</span>
        </li>
        <li onClick={() => handleNavigate("cash")}>
          <BiCategory />
          <span>الطالع</span>
        </li> 
        */}
        <li onClick={() => handleNavigate("OrdersStatus")}>
          <BiCategory />
          <span>كل الطلبات</span>
        </li>
        <li onClick={() => handleNavigate("area")}>
          <BiHomeAlt />
          <span>المنطقه</span>
        </li>

        <li onClick={handleReset}>
          <span >بدء وردية جديدة</span>
        </li>

        <li onClick={handleClose}>
          {close ? <span>فتح التطبيق</span> : <span>اغلاق التطبيق</span>}
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
