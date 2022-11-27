import {useContext, useState} from "react";
import {AppContext} from "../AppContext";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import {Button, Form} from "react-bootstrap";
import {AuthContext} from "../../../context/AuthContext";
import {NotificationContext} from "../../../context/NotificationContext";

export default function CreateResourceType(props) {
    const appCtx = useContext(AppContext)
    const [name, setName] = useState()
    const {post, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    const {parentResourceType, resourceTypes, setResourceTypes} = props

    function handleFormSubmit(e) {
        e.preventDefault()
        post(`apps/${appCtx.app.id}/resourcetypes`, {
            name: name,
            parentId: parentResourceType && parentResourceType.id
        })
            .then(r => {
                if (r) {
                    setResourceTypes([...resourceTypes, r])
                }
            })
            .catch(e => notificationCtx.error("create resource type", e.message))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" >
                <Form.Label>Resource type name</Form.Label>
                <Form.Control type="text" placeholder="Enter resource type name" onChange={handleNameChanged}/>
            </Form.Group>
            {parentResourceType &&
                <Form.Group className="mb-3" >
                    <Form.Label>Parent resource type</Form.Label>
                    <Form.Control disabled type="text" placeholder="Parent resource type" value={parentResourceType.name}/>
                </Form.Group>
            }

            <Button variant="primary" type="submit">
                Create
            </Button>
        </Form>
    </>
}