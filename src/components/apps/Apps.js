
import {useContext, useEffect, useRef, useState} from "react";
import useFetch from "../../hooks/useFetch";
import {AuthContext} from "../../context/AuthContext";
import Loader from "../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import App from "./App";
import CreateApp from "./CreateApp";
import {Card, Form, ListGroup, Table} from 'react-bootstrap';
import {NotificationContext} from "../../context/NotificationContext";
import {Paginator} from "@a11n-io/cerberus-reactjs";

export default function Apps() {

    return <>

        <Routes>
            <Route path=":id/*" element={<App/>}/>
            <Route exact path="/" element={<AppList/>}/>
        </Routes>

    </>

}

function AppList() {
    const auth = useContext(AuthContext)
    const {get, loading} = useFetch("/api/")
    const [showCreate, setShowCreate] = useState(false)
    const notificationCtx = useContext(NotificationContext)
    const [apps, setApps] = useState([])
    const [total, setTotal] = useState(0)
    const [curPage, setCurPage] = useState(0)
    const [filter, setFilter] = useState('')
    const filterRef = useRef(null)

    useEffect(() => {
        get(`accounts/${auth.user.accountId}/apps?sort=name&order=asc&skip=${curPage * 20}&limit=20&filter=${filter}`)
            .then(r => {
                if (r && r.page) {
                    setApps(r.page)
                    setTotal(r.total)
                } else {
                    setApps([])
                    setTotal(0)
                }
            })
            .catch(e => notificationCtx.error("get apps", e.message))
    }, [curPage, filter])

    useEffect(() => {
        filterRef.current.focus()
    }, [apps])

    function handleNewClicked(e) {
        e.preventDefault()
        setShowCreate(p => !p)
    }

    function handleFilterChange(e) {
        setFilter(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Card className="mt-2">
            <Card.Header><h1>Cerberus Apps</h1></Card.Header>
            <Card.Body>
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <th colSpan='2'><Form.Control placeholder='filter' ref={filterRef} value={filter} onChange={handleFilterChange}/></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        apps.map(app => {
                            return (
                                <tr key={app.id}>
                                    <td><Link to={`/apps/${app.id}`}>{app.name}</Link></td>
                                    <td>{app.description}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
                <Paginator
                    curPage={curPage}
                    setCurPage={setCurPage}
                    pageSize={20}
                    pageWindowSize={7}
                    total={total}
                />

                <Link to="" onClick={handleNewClicked}>New App</Link>
                {
                    showCreate && <CreateApp/>
                }
            </Card.Body>
        </Card>

    </>
}