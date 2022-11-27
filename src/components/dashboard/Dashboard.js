import {useContext, useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import Settings from "./Settings";


export default function Dashboard() {

    return <>
        <Routes>
            <Route exact path="/settings" element={<Settings/>}/>
            <Route exact path="/" element={<Content/>}/>
        </Routes>
    </>
}

function Content() {
    return <p>Dashboard</p>
}