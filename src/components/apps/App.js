import {Route, Routes, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import Accounts from "./accounts/Accounts";
import ResourceTypes from "./resourcetypes/ResourceTypes";
import {AppContext} from "./AppContext";
import Policies from "./policies/Policies";
import {ResourceTypeProvider} from "./resourcetypes/ResourceTypeContext";
import {AuthContext} from "../../context/AuthContext";
import Form from "react-bootstrap/Form";
import {Button, Col, Container, Row, Alert, Card} from "react-bootstrap";
import {Permissions} from "@a11n-io/cerberus-reactjs";
import Migrations from "./Migrations";
import {NotificationContext} from "../../context/NotificationContext";

export default function App(props) {
    const params = useParams()
    const auth = useContext(AuthContext)
    const appCtx = useContext(AppContext)
    const {get, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    useEffect(() => {
        get(`accounts/${auth.user.accountId}/apps/${params.id}`)
            .then(d => {
                appCtx.setApp(d);
            })
            .catch(e => notificationCtx.error("get app", e.message))
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!appCtx.app) {
        return <>Could not get app</>
    }

    return <>

        <ResourceTypeProvider>
            <Routes>
                <Route exact path="permissions" element={<AppPermissions/>}/>
                <Route exact path="migrations" element={<Migrations/>}/>
                <Route path="accounts/*" element={<Accounts/>}/>
                <Route path="resourcetypes/*" element={<ResourceTypes/>}/>
                <Route path="policies/*" element={<Policies/>}/>
                <Route exact path="/" element={<AppDashboard/>}/>
            </Routes>
        </ResourceTypeProvider>
    </>
}

function AppDashboard() {
    const appCtx = useContext(AppContext)
    const auth = useContext(AuthContext)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [apiSecret, setApiSecret] = useState("")
    const {put, del, post, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    useEffect(() => {
        setName(appCtx.app.name)
        setDescription(appCtx.app.description)
        setApiKey(appCtx.app.apiKey)
        setApiSecret(appCtx.app.apiSecret)
    }, [appCtx])

    function handleUpdateFormSubmit(e) {
        e.preventDefault()
        put(`accounts/${auth.user.accountId}/apps/${appCtx.app.id}`, {
            name: name,
            description: description
        })
            .then(r => {
                if (r) {
                    appCtx.setApp(r)
                }
            })
            .catch(e => notificationCtx.error("update app", e.message))
    }

    function handleAPIKeyFormSubmit(e) {
        e.preventDefault()
        post(`accounts/${auth.user.accountId}/apps/${appCtx.app.id}/apikey`)
            .then(r => {
                if (r) {
                    appCtx.setApp(r)
                }
            })
            .catch(e => notificationCtx.error("api key", e.message))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    function handleDescriptionChanged(e) {
        setDescription(e.target.value)
    }

    function handleRemoveClicked() {

        del(`accounts/${auth.user.accountId}/apps/${appCtx.app.id}`)
            .then(d => {
                if (d) {
                    appCtx.setApp(null)
                }
            })
            .catch(e => notificationCtx.error("delete app", e.message))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Card className="mt-2">
            <Card.Header><h1>{appCtx.app.name} App</h1></Card.Header>
            <Card.Body>
                <Container>
                    <Row className="mb-5">
                        <Col>
                            <Form onSubmit={handleUpdateFormSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>App name</Form.Label>
                                    <Form.Control type="text" value={name} placeholder="Enter app name" onChange={handleNameChanged}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>App description</Form.Label>
                                    <Form.Control type="text" value={description} placeholder="Enter app description" onChange={handleDescriptionChanged}/>
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                                <Button variant="danger" className="ms-1" onClick={handleRemoveClicked}>
                                    Remove
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form onSubmit={handleAPIKeyFormSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>API Key</Form.Label>
                                    <Form.Control disabled type="text" value={appCtx.app.apiKey}/>
                                </Form.Group>

                                {
                                    appCtx.app.apiSecret &&
                                    <Form.Group className="mb-3">
                                        <Form.Label>API Secret</Form.Label>
                                        <Alert variant="warning">
                                            The secret will only be shown once, please copy and store in a safe place
                                        </Alert>
                                        <Form.Control disabled type="text" value={appCtx.app.apiSecret}/>
                                    </Form.Group>
                                }

                                <Button variant="primary" type="submit">
                                    Generate new API Key
                                </Button>
                            </Form>
                        </Col>
                    </Row>

                </Container>
            </Card.Body>
        </Card>

    </>
}

function AppPermissions() {
    const appCtx = useContext(AppContext)
    const notificationCtx = useContext(NotificationContext)

    function handlePermissionsError(e) {
        notificationCtx.error('permissions', e.message)
    }

    return <>
        <Card className="mt-2">
            <Card.Header><h1>{appCtx.app.name} Permissions</h1></Card.Header>
            <Card.Body>
                <Permissions resourceId={appCtx.app.id} changeAction="ManageAppPermissions" onError={handlePermissionsError}/>
            </Card.Body>
        </Card>
    </>
}