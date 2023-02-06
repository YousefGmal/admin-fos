import React, { useEffect } from "react";

function Category() {
  const handleDelete = async () => {
    const responed = await fetch(
      "https://foosfor.guzzall.com/updateCategory/" +
        window.location.pathname.match(/\w*$/)[0],
      {
        body: JSON.stringify({
          name: "value",
          categoryURL: "value",
          slug: "value",
        }),
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const json = await responed.json();
    console.log(json);
  };

  useEffect(() => {
    handleDelete();
  }, []);

  return (
    <div className="the_category">
      <div className="the_category_c">abc</div>
    </div>
  );
}

export default Category;
