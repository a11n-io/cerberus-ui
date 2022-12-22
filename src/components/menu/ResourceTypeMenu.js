
import {useContext, useEffect, useState} from "react";
import {Link, NavLink, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import {NotificationContext} from "../../context/NotificationContext";

export default function ResourceTypeMenu(props) {
    const [resourceType, setResourceType] = useState()
    const params = useParams()
    const {get, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    const {app} = props

    useEffect(() => {
        if (params.id) {
            get(`apps/${app.id}/resourcetypes/${params.id}`)
                .then(d => setResourceType(d))
                .catch(e => notificationCtx.error("get resource type", e.message))
        }
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!resourceType) {
        return <></>
    }

    return <>
        <div className="navmenu">
            <Link to={`/apps/${app.id}/resourcetypes`}>
                <i className="ico fa-solid fa-arrow-left"></i>
                <i className="txt">{app.name} Resource Types</i>
            </Link>
            <NavLink end to={`actions`}>
                <i className="ico fa-solid fa-hand"></i>
                <i className="txt">Actions</i>
            </NavLink>

        </div>

    </>

}