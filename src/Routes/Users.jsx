import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";

const st =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZGQ2MjI5NWQwOWFiNDQzOTliMDFlMyIsImlzbG9nZ2VkIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU0NTMxNzh9.ftDyy54zr54beRpqtWZ7tdN2dw1M_yYzjO9BhUb9Zv4";

function User({
  id,
  email,
  name,
  gender,
  phone,
  blocked,
  setBlocked,
  setBlockedSlider,
}) {
  const handleClick = () => {
    setBlocked({
      id,
      name,
      email,
      gender,
      blocked,
    });
    setBlockedSlider(true);
  };

  return (
    <div className={`user ${blocked && "blocked"}`} onClick={handleClick}>
      <div className="user_c">
        <div className="user_e">{email}</div>
        <div className="user_n">{name}</div>
        <div className="user_n">{gender}</div>
        <div className="user_g">{phone}</div>
      </div>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [bloked, setBlocked] = useState({});
  const [blockedSlider, setBlockedSlider] = useState(false);
  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState("");

  const handleData = async () => {
    const responed = await fetch("http://153.92.209.101:3000/getUsers/", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: st,
      },
    });

    const json = await responed.json();
    setUsers(json.users);
  };

  const blockUser = async (value) => {
    try {
      const responed = await fetch(
        `http://153.92.209.101:3000/user/block/${bloked.id}`,
        {
          body: JSON.stringify({
            block: value,
          }),
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: st,
          },
        }
      );

      setTimeout(() => {
        window.location.reload();
      });
    } catch {
      console.error("Fail to Post the value");
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <div className="users">
      <div className="users_c">
        <div className="table">
          <div className="table_c">
            <div className="user_e">البريد الاكتروني</div>
            <div className="user_n">الاسم</div>
            <div className="user_e">الجنس</div>
            <div className="user_g">التليفون</div>
            <button type="button" onClick={() => setFilter(!filter)}>
              <AiOutlineSearch />
            </button>
          </div>
        </div>
        {users.length &&
          users
            .filter((user) => {
              return user.phone && user.phone.startsWith(search);
            })
            .map((user) => {
              return (
                <User
                  key={user._id}
                  id={user._id}
                  email={user.email}
                  phone={user.phone}
                  name={user.userName}
                  gender={user.gender}
                  blocked={user.block}
                  setBlocked={setBlocked}
                  setBlockedSlider={setBlockedSlider}
                />
              );
            })}
      </div>
      <div className={`block_user ${blockedSlider ? "open" : "close"}`}>
        <div className="block_user_c">
          <div className="btn_close_c">
            <p>User Details</p>
            <button className="close" onClick={() => setBlockedSlider(false)}>
              <AiOutlineClose />
            </button>
          </div>
          <div className="user_c">
            <div className="user_id">
              <span>id:</span> {bloked.id}
            </div>
            <div className="user_e">
              <span>email:</span> {bloked.email}
            </div>
            <div className="user_n">
              <span>name:</span> {bloked.name}
            </div>
            <div className="user_g">
              <span>gender:</span> {bloked.gender}
            </div>
          </div>
          <div className="btns">
            {bloked.blocked ? (
              <button
                className="unblock"
                onClick={() => blockUser(false)}
                style={{ background: "rgb(112, 240, 112)" }}
              >
                unblock
              </button>
            ) : (
              <button
                className="block"
                onClick={() => blockUser(true)}
                style={{ background: "rgb(255, 45, 45)" }}
              >
                block
              </button>
            )}
          </div>
        </div>
      </div>
      {filter && (
        <div className="user_filer">
          <div className="user_filer_c">
            <input
              type="number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Phone Number"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
