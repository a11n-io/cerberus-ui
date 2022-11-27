import {useContext, useEffect, useState} from "react";
import {AppContext} from "./AppContext";
import useFetch from "../../hooks/useFetch";
import {Button, Card, Table} from "react-bootstrap";
import Loader from "../../uikit/Loader";
import {NotificationContext} from "../../context/NotificationContext";

export default function Migrations() {
    const appCtx = useContext(AppContext)
    const {get, del, loading} = useFetch("/api/")
    const [migrations, setMigrations] = useState([])
    const notificationCtx = useContext(NotificationContext)

    useEffect(() => {
        get(`apps/${appCtx.app.id}/migrations`)
            .then(r => setMigrations(r))
            .catch(e => notificationCtx.error("get migrations", e.message))
    }, [appCtx.app])

    function handleRemoveClicked(e) {
        const version = e.target.getAttribute('data-val1')
        del(`apps/${appCtx.app.id}/migrations/${version}`)
            .then(() => {
                setMigrations(prev => prev.filter(m => m.version.toString() !== version))
            })
            .catch(e => notificationCtx.error("remove migration", e.message))
    }

    if (loading) {
        return <Loader/>
    }

    if (migrations.length === 0) {
        return <p>You have no migrations yet</p>
    }

    return <>
        <Card className="mt-2">
            <Card.Header><h1>{appCtx.app.name} Migrations</h1></Card.Header>
            <Card.Body>
                <Table>
                    <thead>
                    <tr>
                        <th>Version</th>
                        <th>Successful</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        migrations.map(migration => {
                            return (
                                <tr key={migration.version}>
                                    <td>{migration.version}</td>
                                    <td>{migration.dirty ? "no" : "yes"}</td>
                                    <td><Button variant="outline-danger" data-val1={migration.version} onClick={handleRemoveClicked}>Remove</Button></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    </>
}