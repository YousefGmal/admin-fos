import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdModeEditOutline,
  MdOutlineDeleteOutline,
  MdAddCircle,
} from "react-icons/md";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [addNewC, setAddNewC] = useState(false);
  const [delateId, setDeleteId] = useState("");
  const [change, setChange] = useState({
    name: "",
    categoryPic: "",
  });
  const navigate = useNavigate(null);

  const handleEdit = (path) => {
    navigate(path);
  };

  const handleAddNewCategory = async (e) => {
    e.preventDefault();
    if (change.length < 1) {
      return;
    } else {
      await fetch("http://fosfor.guzzall.com/addCategory", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(change),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    window.location.reload();
  };

  const handleDelete = async () => {
    await fetch("http://fosfor.guzzall.com/deleteCategory/" + delateId, {
      method: "POST",
      mode: "cors",
    });
    window.location.reload();
  };

  const getData = async () => {
    const responed = await fetch("http://fosfor.guzzall.com/", {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await responed.json();
    setCategories(json.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="categories">
      <div className="categories_c">
        {categories.map(({ name, categoryPic, _id }) => {
          return (
            <div key={name} className="category name">
              <figure className="category_media">
                <img src={categoryPic} alt="" />
              </figure>
              <div className="category_cover">
                <h3>{name}</h3>
                <div className="btns">
                  <button className="edit" onClick={() => handleEdit(_id)}>
                    <span>
                      <MdModeEditOutline />
                    </span>
                    Edit
                  </button>
                  <button className="delete" onClick={() => setDeleteId(_id)}>
                    <span>
                      <MdOutlineDeleteOutline />
                    </span>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <button className="addCategory" onClick={() => setAddNewC(true)}>
          <MdAddCircle />
        </button>
      </div>
      <form action="" style={{ display: addNewC ? "flex" : "none" }}>
        <div className="form_c">
          <input
            type="text"
            placeholder="Category Name"
            value={change.name}
            onChange={(e) => setChange({ ...change, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="image url"
            value={change.categoryPic}
            onChange={(e) =>
              setChange({ ...change, categoryPic: e.target.value })
            }
          />
          <button onClick={handleAddNewCategory}>Submit</button>
        </div>
      </form>
      <div
        className="are_you_sure"
        style={{ display: delateId.length ? "flex" : "none" }}
      >
        <div className="are_you_sure_c">
          <button className="delete" onClick={handleDelete}>
            Delete
          </button>
          <button className="close" onClick={() => setDeleteId("")}>
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Categories;
