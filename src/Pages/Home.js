import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const Home = () => {

  const [roomId, setRoomId] = useState("");
  // const [userName, setUserName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

//------------------------------ create room function --------------------------------
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("New Room Created");
  };


//---------------------------------- join Room function --------------------------
  const joinRoom = (e) => {
    if (!roomId || !username) {
      toast.error("Please enter valid details");
      return;
    }
    // redirect to editior page
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };


  //----------------- just additional feature of enter clicking------------------------
  const handleEnterButton =(e)=>{
     if(e.code === 'Enter'){
          joinRoom();
     }
  }

  
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homePageLogo" src="/logo1.png" alt="logo" />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          {/* on change is used to set id menually  */}
          <input
            type="text"
            className="inputBox"
            placeholder="Room Id"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleEnterButton}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="User Name"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleEnterButton}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              New Room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built by &nbsp;
          <a href="">Divyansh Raghuvanshi</a> &nbsp;
          {/* <a href="">Vaibhav Rajput</a> */}
        </h4>
      </footer>
    </div>
  );
};

export default Home;
