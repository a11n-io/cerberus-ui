import {Link, Route, Routes} from "react-router-dom";
import AppMenu from "./AppMenu";
import {AppProvider} from "../apps/AppContext";

export default function AppsMenu() {

    return <>
        <Routes>
            <Route exact path="/" element={<Menu/>}/>
            <Route path=":id/*" element={<AppProvider><AppMenu/></AppProvider>}/>
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