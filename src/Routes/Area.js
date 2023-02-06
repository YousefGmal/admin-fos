import { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";

const st =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZGQ2MjI5NWQwOWFiNDQzOTliMDFlMyIsImlzbG9nZ2VkIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU0NTMxNzh9.ftDyy54zr54beRpqtWZ7tdN2dw1M_yYzjO9BhUb9Zv4";

function Area({ id, country, deliveryCost, visible, on, setOn }) {
  const [change, setChange] = useState({ country: "", deliveryCost: "" });
  const [update, setUpdate] = useState(false);

 
  const addNew = async () => {
    if (!change.country) return;
    let responed;
    try {
      if (update) {
        responed = await fetch(
          `http://153.92.209.101:3000/country/update/${id}`,
          {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
              country: change.country,
              deliveryCost: change.deliveryCost,
              visible: "true"
            }),
            headers: {
              "Content-Type": "application/json",
              authorization: st,
            },
          }
        );
      } else {
        responed = await fetch("http://153.92.209.101:3000/country/add", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            country: change.country,
            deliveryCost: change.deliveryCost,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: st,
          },
        });
      }

      await responed.json();
      setOn(false);
      window.location.reload();
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  const handleVisiablty = async () => {
    const responed = await fetch(
      `http://153.92.209.101:3000/visiblecountry/${id}`,
      {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          visible: !visible,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: st,
        },
      }
    );
    responed.ok === "Done" && window.location.reload();
    window.location.reload();
  };

  const handleUpdate = () => {
    setUpdate(true);
    setOn(true);
    setChange({ country: "", deliveryCost: "" });
  };

  const handleClose = () => {
    setOn(!on);
    setUpdate(false);
    setChange({ country: "", deliveryCost: "" });
  };

  return (
    <div className="area">
      <div className="area_c">
        <div className="area_country">{country}</div>
        <div className="area_cost">{deliveryCost}</div>
        <div className="area_button" onClick={handleVisiablty}>
          {visible ? "On" : "Off"}
        </div>
        <div className="area_button" onClick={handleUpdate}>
          update
        </div>
      </div>
      <div
        className="input_area_container"
        style={{ display: on ? "block" : "none" }}
      >
        <button className="close_input" onClick={handleClose}>
          <AiOutlineCloseCircle />
        </button>
        <input
          type="text"
          className="input_area_country"
          placeholder="Area"
          value={change.country}
          onChange={(e) => setChange({ ...change, country: e.target.value })}
        />
        <input
          type="text"
          className="input_area_cost"
          placeholder="Cost"
          value={change.deliveryCost}
          onChange={(e) =>
            setChange({ ...change, deliveryCost: e.target.value })
          }
        />
        <button className="add_input" onClick={addNew}>
          Add
        </button>
      </div>
    </div>
  );
}

function Areas() {
  const [areas, setAreas] = useState([]);
  const [on, setOn] = useState(false);

  const handleData = async () => {
    try {
      const responed1 = await fetch(
        "http://153.92.209.101:3000/allcountries/",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: st,
          },
        }
      );

      const json1 = await responed1.json();
      setAreas(json1.data);
      console.log(json1);
    } catch {
      console.error("Failed To Get The Data!");
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <div className="areas">
      <div className="areas_c">
        <div className="table">
          <div className="table_c">
            <div className="areas_name">Areas</div>
            <div className="areas_cost">Cost</div>
            <div className="areas_visible">Visiable</div>
            <div className="area_button">update</div>
          </div>
        </div>
        <div className="areas_container">
          {areas.length &&
            areas.map((r) => {
              const { country, deliveryCost, visible, _id } = r;
              return (
                <Area
                  key={_id}
                  country={country}
                  deliveryCost={deliveryCost}
                  visible={visible}
                  id={_id}
                  on={on}
                  setOn={setOn}
                  setAreas={setAreas}
                  areas={areas}
                />
              );
            })}
        </div>
        <div className="create_new_area">
          <button type="button" onClick={() => setOn(true)}>
            <IoMdAddCircleOutline />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Areas;
