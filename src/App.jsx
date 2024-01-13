import './App.css';
import Login from './components/Authorization/Login';

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Dashboard from './components/Dashboard/Dashboard';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />}></Route>
              
            </Routes>
        </BrowserRouter>
    );
}

export default App;
