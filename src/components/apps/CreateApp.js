import {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import {Button, Form} from "react-bootstrap";
import {NotificationContext} from "../../context/NotificationContext";

export default function CreateApp() {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const {post, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    function handleFormSubmit(e) {
        e.preventDefault()
        post("accounts/"+auth.user.accountId+"/apps", {
            name: name,
            description: description
        })
            .then(r => {
                if (r) {
                    navigate("/apps/" + r.id)
                }
            })
            .catch(e => notificationCtx.error('Create App', e.message))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    function handleDescriptionChanged(e) {
        setDescription(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>App name</Form.Label>
                <Form.Control type="text" placeholder="Enter app name" onChange={handleNameChanged}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Enter app description" onChange={handleDescriptionChanged}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Create
            </Button>
        </Form>
    </>
}