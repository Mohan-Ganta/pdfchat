import { useState } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import chatlogo from "../assets/chatlogo.png";

export default function Conversation() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMessageSubmit = async () => {
    if (!inputText.trim()) {
      console.log("Input text is empty.");
      return;
    }
    console.log("Sending message:", inputText);
    try {
      setLoading(true);
      const formData = new FormData();
      if (fileData) {
        formData.append("fileData", fileData);
      }
      formData.append("query", inputText);
      const response = await fetch("http://localhost:8080/general_qa", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Received response:", data.response);
        const newMessages = [...messages, { text: inputText, isUser: true }, { text: data.response, isUser: false }];
        setMessages(newMessages);
        setInputText('');
      } else {
        throw new Error("Failed to fetch response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleMessageSubmit();
    }
  };

  return (
    <div className='rounded-md flex flex-col justify-end' style={{height:"calc( 100vh - 100px )"}} >
      <div className='w-full overflow-y-auto h-[-webkit-fill-available]'>
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 items-center ${message.isUser ? "flex-row-reverse" : ""}`}>
            <div className='border px-3 py-1.5 rounded-full grid place-items-center h-10 w-10'>
              {message.isUser ? <img src={chatlogo} alt="DZ" className="w-full rounded-xl" /> : "C"}
            </div>
            <div className='bg-green-600 px-3 py-1 rounded-md text-white'>{message.text}</div>
          </div>
        ))}
      </div>
      <div className='sticky bottom-0 '>
        <div className='flex gap-2 items-center'>
          <img src={chatlogo} alt="DZ" className='border border-green-600 !w-14 !h-12 p-1.5 pl-2 rounded-full cursor-pointer' />
          <TextField
            placeholder="Enter Your Query Here...!!"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            size='small'
            fullWidth
            sx={{
              "& input": {
                color: "#000000",
                "&::placeholder": { color: "#000000", opacity: 1 },
              },
              "& fieldset": { border: "none" },
              minWidth: "fit-content",
              overflow: "hidden",
              border: "1px solid #228B22",
              borderRadius: "36px",
              color: "#228B22",
            }}
            className="w-full py-0 rounded-md border-0 bg-white ring-black focus:ring-4 focus:ring-inset focus:ring-black"
          />
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendIcon onClick={handleMessageSubmit} className='border border-green-600 !w-12 !h-12 p-1.5 pl-2 rounded-full cursor-pointer' fontSize='small' />
          )}
        </div>
      </div>
    </div>
  );
}
