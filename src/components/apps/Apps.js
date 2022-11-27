
import {useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import {AuthContext} from "../../context/AuthContext";
import Loader from "../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import App from "./App";
import CreateApp from "./CreateApp";
import {Card, ListGroup} from 'react-bootstrap';
import {NotificationContext} from "../../context/NotificationContext";

export default function Apps() {

    return <>

        <Routes>
            <Route path=":id/*" element={<App/>}/>
            <Route exact path="/" element={<AppList/>}/>
        </Routes>

    </>

}

function AppList() {
    const [apps, setApps] = useState([])
    const auth = useContext(AuthContext)
    const {get, loading} = useFetch("/api/")
    const [showCreate, setShowCreate] = useState(false)
    const notificationCtx = useContext(NotificationContext)

    useEffect(() => {
        get("accounts/"+auth.user.accountId+"/apps")
            .then(d => setApps(d))
            .catch(e => notificationCtx.error("get apps", e.message))
    }, [])

    function handleNewClicked(e) {
        e.preventDefault()
        setShowCreate(p => !p)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Card className="mt-2">
            <Card.Header><h1>Cerberus Apps</h1></Card.Header>
            <Card.Body>
                <ListGroup>
                    {
                        apps.map(app => {
                            return (
                                <ListGroup.Item  key={app.id}>
                                    <Link to={`/apps/${app.id}`}>{app.name}</Link>
                                </ListGroup.Item>
                            )
                        })
                    }

                    <Link to="" onClick={handleNewClicked}>New App</Link>

                    {
                        showCreate && <CreateApp/>
                    }
                </ListGroup>
            </Card.Body>
        </Card>

    </>
}