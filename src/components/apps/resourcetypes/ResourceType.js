import {Button, Card, ListGroup, Tab, Tabs} from "react-bootstrap";
import CreateResourceType from "./CreateResourceType";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../AppContext";
import useFetch from "../../../hooks/useFetch";
import Form from "react-bootstrap/Form";
import Actions from "../actions/Actions";
import {AuthContext} from "../../../context/AuthContext";
import Loader from "../../../uikit/Loader";
import {NotificationContext} from "../../../context/NotificationContext";
import {Confirmation} from "@a11n-io/cerberus-reactjs";


export default function ResourceType(props) {
    const auth = useContext(AuthContext)
    const {resourceType, setSelectedResourceType, resourceTypes, setResourceTypes} = props

    return <>
        <Card>
            <Card.Header>
                <h2>Resource Type: {resourceType.name}</h2>
            </Card.Header>
            <Card.Body>
                <Tabs
                    defaultActiveKey="actions"
                    className="mb-3"
                >
                    <Tab eventKey="actions" title="Actions">
                        <Actions resourceType={resourceType}/>
                    </Tab>
                    <Tab eventKey="add" title="Add Child">
                        <CreateResourceType parentResourceType={resourceType} resourceTypes={resourceTypes} setResourceTypes={setResourceTypes}/>
                    </Tab>
                    <Tab eventKey="details" title="Details">
                        <Details resourceType={resourceType} setSelectedResourceType={setSelectedResourceType} setResourceTypes={setResourceTypes}/>
                    </Tab>
                    {/*<Tab eventKey="permissions" title="Permissions">*/}
                    {/*    <Permissions resourceId={resourceType.id} />*/}
                    {/*</Tab>*/}

                </Tabs>

            </Card.Body>
        </Card>
    </>
}

function Details(props) {
    const appCtx = useContext(AppContext)
    const [name, setName] = useState("")
    const {put, del, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)
    const [deletingResourceType, setDeletingResourceType] = useState('')

    const {resourceType, setSelectedResourceType, setResourceTypes} = props

    useEffect(() => {
        setName(resourceType.name)
    }, [resourceType])

    function handleFormSubmit(e) {
        e.preventDefault()
        put(`apps/${appCtx.app.id}/resourcetypes/${resourceType.id}`, {
            name: name,
            parentId: resourceType.parentId
        })
            .then(r => {
                if (r) {
                    setResourceTypes(prev => [...prev.filter(p => p.id !== r.id), r])
                }
            })
            .catch(e => notificationCtx.error("update resource type", e.message))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    function handleRemoveClicked() {
        setDeletingResourceType(resourceType.id)
    }

    function handleDenyDelete() {
        setDeletingResourceType('')
    }

    function handleConfirmDelete() {
        del(`apps/${appCtx.app.id}/resourcetypes/${deletingResourceType}`)
            .then(d => {
                if (d) {
                    setSelectedResourceType(null)
                    setResourceTypes(prev => {
                        return prev.filter(p => p.id !== resourceType.id)
                    })
                    setDeletingResourceType('')
                }
            })
            .catch(e => notificationCtx.error("remove resource type", e.message))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Confirmation
            onConfirm={handleConfirmDelete}
            onDeny={handleDenyDelete}
            show={deletingResourceType !== ''}
            header='Delete Resource Type'
            body={`This cannot be undone. Are you sure?`}
        />
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Resource type name</Form.Label>
                <Form.Control type="text" value={name} placeholder="Enter resource type name" onChange={handleNameChanged}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Update
            </Button>
            <Button variant="danger" className="ms-1" onClick={handleRemoveClicked}>
                Remove
            </Button>

        </Form>
    </>
}
