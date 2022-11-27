
import {useContext, useEffect, useState} from "react";
import {Link, NavLink, Route, Routes, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import {ResourceTypeContext} from "../apps/resourcetypes/ResourceTypeContext";
import {AppContext, AppProvider} from "../apps/AppContext";
import AppMenu from "./AppMenu";
import ResourceTypeMenu from "./ResourceTypeMenu";

export default function ResourceTypesMenu(props) {
    const {app} = props

    return <>
        <Routes>
            <Route exact path="/" element={<Menu app={app}/>}/>
            <Route path=":id/*" element={<ResourceTypeMenu app={app}/>}/>
        </Routes>
    </>
}

function Menu(props) {
    const {app} = props

    return <>
        <div className="navmenu">
            <Link to={`/apps/${app.id}`}>
                <i className="ico fa-solid fa-arrow-left"></i>
                <i className="txt">{app.name} App</i>
            </Link>
        </div>
    </>
}