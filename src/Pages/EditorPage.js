import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import ACTIONS from "../Action";
import { initSocket } from "../Socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { Socket } from "socket.io-client";

const EditorPage = () => {
  // Socket connection initialization

  const socketRef = useRef(null);
  const { roomId } = useParams();
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // listening for join
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined the room`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code: codeRef.current,
            socketId: socketId
          })
        }
      );

      // for disconnected listening
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyId(){
    try {
      await navigator.clipboard.writeText(roomId)
      toast.success(`Room ID has been copied`);
    } catch (error) {
      toast.error('Could not copy Room ID');
      console.log(error);
    }
  }

  function leaveRoom(){
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="left">
        <div className="leftInner">
          <div className="logo">
            <img className="logoImage" src="/logo1.png" alt="logo" />
          </div>
          <h3 id="connected_user">Connected Users</h3>
          <div className="usersList">
            {clients.map((client) => (
              <Client
                className="client"
                key={client.socketId}
                username={client.username}
              />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyId}>Copy Room Id</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
      </div>
      <div className="right">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current = code}}/>
      </div>
    </div>
  );
};

export default EditorPage;
