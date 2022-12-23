import {useContext, useEffect, useState} from "react";
import {AppContext} from "./AppContext";
import useFetch from "../../hooks/useFetch";
import {Button, Card, Form, Table} from "react-bootstrap";
import Loader from "../../uikit/Loader";
import {NotificationContext} from "../../context/NotificationContext";
import {Confirmation, Paginator} from "@a11n-io/cerberus-reactjs";

export default function Migrations() {
    const appCtx = useContext(AppContext)
    const {get, del, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)
    const [migrations, setMigrations] = useState([])
    const [total, setTotal] = useState(0)
    const [curPage, setCurPage] = useState(0)
    const [deletingMigration, setDeletingMigration] = useState('')

    useEffect(() => {
        get(`apps/${appCtx.app.id}/migrations?sort=version&order=desc&skip=${curPage * 20}&limit=20`)
            .then(r => {
                if (r && r.page) {
                    setMigrations(r.page)
                    setTotal(r.total)
                } else {
                    setMigrations([])
                    setTotal(0)
                }
            })
            .catch(e => notificationCtx.error("get migrations", e.message))
    }, [appCtx.app, curPage])

    function handleRemoveClicked(e) {
        const version = e.target.getAttribute('data-val1')
        setDeletingMigration(version)
    }

    function handleDenyDelete() {
        setDeletingMigration('')
    }

    function handleConfirmDelete() {

        del(`apps/${appCtx.app.id}/migrations/${deletingMigration}`)
            .then(() => {
                setMigrations(prev => prev.filter(m => m.version.toString() !== deletingMigration))
                setDeletingMigration('')
            })
            .catch(e => notificationCtx.error("remove migration", e.message))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Confirmation
            onConfirm={handleConfirmDelete}
            onDeny={handleDenyDelete}
            show={deletingMigration !== ''}
            header='Delete Migration'
            body={`You will have to rerun the migrations. Are you sure?`}
        />
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
                <Paginator
                    curPage={curPage}
                    setCurPage={setCurPage}
                    pageSize={20}
                    pageWindowSize={7}
                    total={total}
                />
            </Card.Body>
        </Card>
    </>
}