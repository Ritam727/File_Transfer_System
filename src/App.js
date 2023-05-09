import './style.scss';
import {Routes, Route} from "react-router-dom";
// import DragDropFile from './components/DragDropFile';
import Home from './pages/Home';
import Room from "./pages/Room";
import CreateRoom from "./pages/CreateRoom";

function App() {
  return (
    <>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/sender' element={<CreateRoom/>}></Route>
          <Route path='/receiver' element={<Room/>}></Route>
        </Routes>
    </>
  );
}

export default App;
