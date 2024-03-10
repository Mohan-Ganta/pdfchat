import React, { useRef, useState } from 'react';
import Home from './screens/Home';
import Chat from './screens/Chat';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Layout from './components/Layout';

export default function App() {
  const [fileData, setFileData] = useState(null);

  return (
    <div className='h-screen'>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home setFileData={setFileData} />} />
            <Route path="chat" element={<Chat fileData={fileData} setFileData={setFileData} />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}
