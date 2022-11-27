import {Link, Route, Routes} from "react-router-dom";

export default function AppPermissionsMenu(props) {
    const {app} = props

    return <>
        <Routes>
            <Route exact path="/" element={<Menu app={app}/>}/>
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