import {useNavigate, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {useContext, useState} from "react";
import Loader from "../../uikit/Loader";
import {Button, Form} from "react-bootstrap";
import {NotificationContext} from "../../context/NotificationContext";

export default function ForgotPassword() {

    const navigate = useNavigate()
    const {post, loading} = useFetch("/")
    const [email, setEmail] = useState()
    const notificationCtx = useContext(NotificationContext)

    function handleSubmit(e) {
        e.preventDefault()
        post("auth/forgotpassword", {
            email: email,
        })
            .then(r => {
                navigate("/login")
            })
            .catch(e => notificationCtx.error("forgot password", e.message))
    }

    function handleEmailChanged(e) {
        setEmail(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={handleEmailChanged}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Send reset link
            </Button>
        </Form>
    </>
}