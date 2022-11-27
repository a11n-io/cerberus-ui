import {NavLink, useNavigate, Routes, Route} from "react-router-dom";
import {useContext} from "react";
import {AuthContext, AuthGuard} from "../../context/AuthContext";
import AppsMenu from "./AppsMenu";
import SettingsMenu from "./SettingsMenu";

export default function Navmenu() {

    return <>
            <div id="pguser">
                <NavLink to="/">
                    <img src="/img/logo.png" width="100px"/>
                </NavLink>
            </div>
            <AuthGuard>
                <Routes>
                    <Route exact path="/" element={<Menu/>}/>
                    <Route path="/settings/*" element={<SettingsMenu/>}/>
                    <Route path="/apps/*" element={<AppsMenu/>}/>
                </Routes>
            </AuthGuard>
    </>
}

function Menu() {

    const auth = useContext(AuthContext)

    return <>
        <NavLink to={`/settings`}>
            <i className="ico fa-solid fa-user-shield"></i>
            <i className="txt">Settings</i>
        </NavLink>
        <NavLink to="/apps">
            <i className="ico fa-solid fa-rocket"></i>
            <i className="txt">Apps</i>
        </NavLink>
    </>
}