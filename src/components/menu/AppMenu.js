
import {useContext, useEffect, useState} from "react";
import {Link, NavLink, Route, Routes, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import {AuthContext} from "../../context/AuthContext";
import ResourceTypesMenu from "./ResourceTypesMenu";
import PoliciesMenu from "./PoliciesMenu";
import AppPermissionsMenu from "./AppPermissionsMenu";
import MigrationsMenu from "./MigrationsMenu";
import {NotificationContext} from "../../context/NotificationContext";
import DataMenu from "./DataMenu";

export default function AppMenu() {
    const [app, setApp] = useState()
    const params = useParams()
    const authCtx = useContext(AuthContext)
    const {get, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    useEffect(() => {
        if (params.id) {
            get(`accounts/${authCtx.user.accountId}/apps/${params.id}`)
                .then(d => setApp(d))
                .catch(e => notificationCtx.error("get app", e.message))
        }
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!app) {
        return <></>
    }

    return <>
        <Routes>
            <Route exact path="/" element={<Menu app={app}/>}/>
            <Route path="permissions/*" element={<AppPermissionsMenu app={app}/>}/>
            <Route path="migrations/*" element={<MigrationsMenu app={app}/>}/>
            <Route path="resourcetypes/*" element={<ResourceTypesMenu app={app}/>}/>
            <Route path="policies/*" element={<PoliciesMenu app={app}/>}/>
            <Route path="accounts/*" element={<DataMenu app={app}/>}/>
        </Routes>
    </>

}

function Menu(props) {
    const {app} = props

    return (
        <div className="navmenu">
            <Link to={`/apps`}>
                <i className="ico fa-solid fa-arrow-left"></i>
                <i className="txt">Apps</i>
            </Link>

            <NavLink to={`permissions`}>
                <i className="ico fa-solid fa-user-shield"></i>
                <i className="txt">Permissions</i>
            </NavLink>
            <NavLink to={`migrations`}>
                <i className="ico fa-solid fa-database"></i>
                <i className="txt">Migrations</i>
            </NavLink>
            <NavLink end to={`/apps/${app.id}/resourcetypes`}>
                <i className="ico fa-solid fa-shapes"></i>
                <i className="txt">Resource Types</i>
            </NavLink>
            <NavLink end to={`/apps/${app.id}/policies`}>
                <i className="ico fa-solid fa-file-shield"></i>
                <i className="txt">Policies</i>
            </NavLink>
            <NavLink end to={`/apps/${app.id}/accounts`}>
                <i className="ico fa-solid fa-table"></i>
                <i className="txt">Data</i>
            </NavLink>

        </div>
    )
}