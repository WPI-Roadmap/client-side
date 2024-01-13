import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Roadmap from './Roadmap.js';

function App() {
  return (
    <>
     <BrowserRouter>
            <Routes>
              <Route path="/" element={<Roadmap />} />
            </Routes>
          </BrowserRouter>
    </>
  );
}

export default App;
