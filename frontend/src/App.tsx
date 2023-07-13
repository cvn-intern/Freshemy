import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChangePassword from "./pages/ChangePassword";
import Login from './pages/Login'



function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/change-password" element={<ChangePassword />}></Route>
                    <Route path="/login" element={<Login isLogin={true}/>}></Route>

                </Routes>
            </BrowserRouter>
        </>
  );
}



export default App;
