
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import Loader from "../../../uikit/Loader";
import {NotificationContext} from "../../../context/NotificationContext";

export default function Action(props) {

    const [name, setName] = useState("")
    const {put, del, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    const {action, resourceType, setSelectedAction, actions, setActions} = props

    useEffect(() => {
        setName(action.name)
    }, [action])

    function handleFormSubmit(e) {
        e.preventDefault()
        put(`resourcetypes/${resourceType.id}/actions/${action.id}`, {
            name: name
        })
            .then(r => {
                if (r) {
                    setActions(prev => [...prev.filter(a => a.id !== r.id), r])
                }
            })
            .catch(e => notificationCtx.error("update action", e.message))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    function handleRemoveClicked() {

        del(`resourcetypes/${resourceType.id}/actions/${action.id}`)
            .then(d => {
                if (d) {
                    setSelectedAction(null)
                    setActions(prev => {
                        return prev.filter(a => a.id !== action.id)
                    })
                }
            })
            .catch(e => notificationCtx.error("remove action", e.message))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" >
                <Form.Label>Action name</Form.Label>
                <Form.Control type="text" value={name} placeholder="Enter action name" onChange={handleNameChanged}/>
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
