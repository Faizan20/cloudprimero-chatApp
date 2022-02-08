import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/conversation";
import Message from "../../components/message/message";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import {io} from "socket.io-client";

export default function Messenger() {
  const [conversations, setConversations] = useState([]) 
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const socket = useRef()
  const { userId, token } = useContext(AuthContext)
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900")
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      })
    })

  }, [])

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    socket.current.emit("addUser", userId)
  }, [userId])

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + userId, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+ token}});
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userId, token]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+ token}});
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: userId,
      text: newMessage,
      conversationId: currentChat._id
    }

    socket.current.emit("sendMessage", {
      senderId: userId,
      receiverId: currentChat.members.find(member => member !== userId),
      text: newMessage
    })

    try {
      const res = await axios.post("/messages/", message, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+ token}});
      setMessages([...messages, res.data])
      setNewMessage("")
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
          <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c, i) => (
              <div key={i} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c}  currentUserId={userId} token={token}/>
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
          {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, i) => (
                    <div key={i} ref={scrollRef}>
                      <Message message={m} own={m.sender === userId} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" disabled={newMessage === ""}onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}