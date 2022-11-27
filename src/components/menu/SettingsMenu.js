import {Link, Route, Routes} from "react-router-dom";

export default function SettingsMenu() {
    return <>
        <Routes>
            <Route exact path="/" element={<Menu/>}/>
        </Routes>
    </>
}

function Menu() {

    return <>
        <div className="navmenu">
            <Link to={`/`}>
                <i className="ico fa-solid fa-arrow-left"></i>
                <i className="txt">Home</i>
            </Link>
        </div>
    </>
}