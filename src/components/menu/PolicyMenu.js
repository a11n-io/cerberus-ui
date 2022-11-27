
import {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import {NotificationContext} from "../../context/NotificationContext";

export default function PolicyMenu(props) {
    const [policy, setPolicy] = useState()
    const params = useParams()
    const {get, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    const {app} = props

    useEffect(() => {
        if (params.id) {
            get(`apps/${app.id}/policies/${params.id}`)
                .then(d => setPolicy(d))
                .catch(e => notificationCtx.error("get policy", e.message))
        }
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!policy) {
        return <></>
    }

    return <>
        <div className="navmenu">
            <Link to={`/apps/${app.id}/policies`}>
                <i className="ico fa-solid fa-arrow-left"></i>
                <i className="txt">{app.name} Policies</i>
            </Link>

        </div>

    </>

}