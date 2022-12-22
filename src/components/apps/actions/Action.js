
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import Loader from "../../../uikit/Loader";
import {NotificationContext} from "../../../context/NotificationContext";
import {Confirmation} from "@a11n-io/cerberus-reactjs";

export default function Action(props) {

    const [name, setName] = useState("")
    const {put, del, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)
    const [deletingAction, setDeletingAction] = useState('')

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
        setDeletingAction(action.id)
    }

    function handleDenyDelete() {
        setDeletingAction('')
    }

    function handleConfirmDelete() {

        del(`resourcetypes/${resourceType.id}/actions/${deletingAction}`)
            .then(d => {
                if (d) {
                    setSelectedAction(null)
                    setActions(prev => {
                        return prev.filter(a => a.id !== action.id)
                    })
                    setDeletingAction('')
                }
            })
            .catch(e => notificationCtx.error("remove action", e.message))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Confirmation
            onConfirm={handleConfirmDelete}
            onDeny={handleDenyDelete}
            show={deletingAction !== ''}
            header='Delete Action'
            body={`This cannot be undone. You have to be sure no code relies on this action. Are you sure?`}
        />
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
