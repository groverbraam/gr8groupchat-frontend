import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ReactPlayer from "react-player/lazy";
import "../App.css";
import {
  Button,
  Slider,
  Input,
  Avatar,
  GroupsIcon,
  Alert,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import NavBar from "./navBar";
import Footer from "./footer";
import ReactEmoji from "react-emoji";
import { wait } from "@testing-library/user-event/dist/utils";

function Room(props) {
  const [message, setMessage] = useState("");
  const [Duration, setDuration] = useState(0);
  const [chat, setChat] = useState([]);
  const [songSubmission, setSongSubmission] = useState("");
  const [songSubmissionTitle, setSongSubmissionTitle] = useState("");
  const [songs, setSongs] = useState("");
  const [upNext, setUpNext] = useState([]);
  const [playing, setPlaying] = useState(true);
  const [played, setPlayed] = useState(0);
  const [countUsers, setCountUsers] = useState(0);
  const [mute, setMute] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState([]);
  const [scrolling, setScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [oneWordMessage, setOneWordMessage] = useState(true);

  const socketRef = useRef();
  const playerRef = useRef();
  const messagesEndRef = useRef(null);

  // console.log(props.name);
  // const socket = io("http://localhost:3003");

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [chat]);

  ////TRYING TO FIGURE OUT HOW TO ONLY SUBMIT ONE AT A TIME
  // const checkSubmission = () => {
  //    console.log(typeof(upNext[0].id))
  //    const test = upNext[0].id
  //   if (submissionId.includes(test)) {
  //     // setSubmitted(true)
  //     console.log('still in queue')
  //   } else {
  //     setSubmitted(false)
  //     console.log('not in queue')
  //   }
  // }

  // console.log(submissionId)

  // HANDLES THE WORD SUBMISSION
  const handleChange = (e) => {
    if (e.target.value.includes(" ")) {
      e.preventDefault();
      clearoneWordMessage();
      console.log(oneWordMessage);
      e.target.value = '';
    } else {
      setTimeout(() => {
        setOneWordMessage(false);
        console.log('i waited');
      }, 5000);
      setMessage(e.target.value);
    }
  };

  // CLEARS THE CHAT IF THE USER PUTS MORE THAN ONE WORD
  const clearoneWordMessage = () => {
    if (oneWordMessage === true) {
      setTimeout(() => {
        setOneWordMessage(false);
        console.log('i waited');
      }, 5000);
    } else {
      setOneWordMessage(true);
    }
  };

  // HANDLES THE SCROLL BEHAVIOR
  const handleScroll = (e) => {
    const position = e.currentTarget.scrollTop;
    const positionMax = e.currentTarget.scrollHeight - 400;
    setCurrentPosition(positionMax);
    setScrollPosition(position);
  };
  // SUBMITS THE MESSAGE TO THE BACKEND
  const onMessageSubmit = (e) => {
    e.preventDefault();
    socketRef.current.emit("send-message", message, props.name);
    e.target.reset();
    setMessage("");
  };

  // SCROLLS TO THE BOTTOMS ONCE A NEW MESSAGE IS ENTERED
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // LISTENS FOR THE NEW MESSAGE FOR THE SCROLL TO BOTTOM BEHAVIOR
  useEffect(() => {
    if (scrollPosition == currentPosition) {
      scrollToBottom();
    }
    return;
  }, [chat]);

  // MAKES SURE THAT THE USER ONLY ENTERS ONE WORD
  const maxLengthCheck = (e) => {
    if (e.target.value.length > e.target.maxLength) {
      e.target.value = e.target.value.slice(0, e.target.maxLength);
    }
  };

  // RENDERS ALL THE MESSAGES TO THE CHAT
  const renderChat = () => {
    const names = props.name;
    return chat.map((message, index) => (
      <>
        <div className="entireChat" key={index}>
          <p className="message">
            {message.name ? (
              <span className="message">
                <p classname="username-message">{message.name}</p>{" "}
                {ReactEmoji.emojify(message.message)}
              </span>
            ) : (
              <span className="message">
                {ReactEmoji.emojify(message.message)}
              </span>
            )}
          </p>
        </div>
        <div ref={messagesEndRef}></div>
      </>
    ));
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:3003");
    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    //  STORES MESSAGES IN THE CHAT
    socketRef.current.once("receive-message", (message, name) => {
      setChat([...chat, { message: message, name: name }]);
    });

    // SENDS JOIN MESSAGE
    socketRef.current.once("join-message", (message) => {
      setChat([...chat, message]);
    });

    // SENDS THE LEAVE MESSAGE
    socketRef.current.once("leave-message", (message) => {
      setChat([...chat, message]);
    });

    // SETS THE NUMBER OF USERS WHEN SOMEONE LEAVES
    socketRef.current.on("leave-message-2", (number) => {
      const test = parseInt(number);
      setCountUsers(countUsers - 1);
    });

    // SETS THE NUMBER OF USERS
    socketRef.current.on("user-count", (number) => {
      setCountUsers(number);
    });

    // SENDS THE SONGS
    socketRef.current.on(
      "song-recieved",
      (songSubmission, songSubmissionTitle, song, name) => {
        if (songs === "") {
          song ? setSongs(song) : setSongs(songSubmission);
        } else {
          setUpNext([
            ...upNext,
            {
              submittedSong: songSubmission,
              title: songSubmissionTitle,
              currentSong: song,
              id: name,
            },
          ]);
          setSubmissionId([...submissionId, name]);
        }
      }
    );

    // SENDS THE SONGS NOTIFICATION
    socketRef.current.on("send-notification", (message) => {
      setChat([...chat, message]);
    });
  }, [chat, songs, upNext]);

  // console.log(played)
  // console.log(submissionId)
  // console.log(submitted)

  return (
    <>
      {/* <NavBar /> */}
      <div className="main-container">
        {/*  CHAT DISPLAY */}
        <div className="sub-container">
          <h3 className="chat-box-header">GR8 GROUPCHAT</h3>
          <div className="groupchat-pic">
            <Avatar
              alt="Leafs"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCZ-1HgOTCUfihoRRvIAAfPCHVDTQpVdSHGA&usqp=CAU"
            />
          </div>
          <div className="user-container">
            <PeopleIcon />
            <p> {countUsers}</p>
          </div>
        </div>
        <div className="chat-body">
          <div className="chat-box" onScroll={handleScroll}>
            {renderChat()}
          </div>
          <form className="message-form" onSubmit={onMessageSubmit}>
            <div ref={messagesEndRef} />
            <br />
            <Input
              type="text"
              onChange={handleChange}
              // onInput={maxLengthCheck}
              required
            />
            <Input type="submit" />{" "}
            {oneWordMessage ? (
              <Alert severity="warning">
                Please only submit one word!
              </Alert>
            ) : (
              <div></div>
            )}
          </form>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Room;
