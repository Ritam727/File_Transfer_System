import { Routes, Route } from "react-router-dom";
// import DragDropFile from './components/DragDropFile';
import Home from "./pages/Home";
import Room from "./pages/Room";
import GettingStarted from "./pages/GettingStarted";
import FileSender from "./pages/FileSender";
import FileReceiver from "./pages/FileReceiver";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/gettingstarted" element={<GettingStarted />}></Route>
        <Route path="/sender" element={<FileSender />}></Route>
        <Route path="/receiver" element={<FileReceiver />}></Route>
      </Routes>
    </>
  );
}

export default App;
