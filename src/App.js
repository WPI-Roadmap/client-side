import logo from './logo.svg';
import './App.css';
import Login from './Authorization/Login';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Dashboard from './Dashboard/Dashboard';
import DataParse from './DataParse/DataParse';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/dataparse" element={<DataParse />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
