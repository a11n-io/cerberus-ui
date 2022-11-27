import {useContext, useState} from "react";
import {AppContext} from "../AppContext";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import {Button, Form} from "react-bootstrap";
import {NotificationContext} from "../../../context/NotificationContext";

export default function CreatePolicy(props) {
    const appCtx = useContext(AppContext)
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const {post, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    const {parentPolicy, policies, setPolicies} = props

    function handleFormSubmit(e) {
        e.preventDefault()
        post("apps/"+appCtx.app.id+"/policies", {
            name: name,
            description: description,
            parentId: parentPolicy && parentPolicy.id
        })
            .then(r => {
                if (r) {
                    setPolicies([...policies, r])
                }
            })
            .catch(e => notificationCtx.error("create policy", e.message))
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
            <Form.Group className="mb-3" >
                <Form.Label>Policy name</Form.Label>
                <Form.Control type="text" placeholder="Enter policy name" onChange={handleNameChanged}/>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label>Policy description</Form.Label>
                <Form.Control type="text" placeholder="Enter policy description" onChange={handleDescriptionChanged}/>
            </Form.Group>

            {parentPolicy &&
                <Form.Group className="mb-3" >
                    <Form.Label>Parent policy</Form.Label>
                    <Form.Control disabled type="text" placeholder="Parent policy" value={parentPolicy.name}/>
                </Form.Group>
            }

            <Button variant="primary" type="submit">
                Create
            </Button>
        </Form>
    </>
}