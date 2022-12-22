
import {Link, NavLink, Route, Routes, useParams} from "react-router-dom";
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