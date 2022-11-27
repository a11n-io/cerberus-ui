import {useContext, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import {Button, Form} from "react-bootstrap";
import {NotificationContext} from "../../../context/NotificationContext";

export default function CreateAction(props) {
    const [name, setName] = useState()
    const {post, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    const {resourceType, actions, setActions} = props

    function handleFormSubmit(e) {
        e.preventDefault()
        post("resourcetypes/"+resourceType.id+"/actions", {
            name: name,
        })
            .then(r => {
                if (r) {
                    setActions([...actions, r])
                }
            })
            .catch(e => notificationCtx.error("create action", e.message))
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
                <Form.Label>Action name</Form.Label>
                <Form.Control type="text" placeholder="Enter action name" onChange={handleNameChanged}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Create
            </Button>
        </Form>
    </>
}