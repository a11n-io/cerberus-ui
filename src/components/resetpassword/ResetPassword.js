import {useNavigate, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {useContext, useState} from "react";
import Loader from "../../uikit/Loader";
import {Button, Form} from "react-bootstrap";
import {NotificationContext} from "../../context/NotificationContext";

export default function ResetPassword() {

    const params = useParams()
    const navigate = useNavigate()
    const {post, loading} = useFetch("/")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")
    const notificationCtx = useContext(NotificationContext)

    function handleSubmit(e) {
        e.preventDefault()
        post("auth/resetpassword", {
            hash: params.hash,
            password1: password1,
            password2: password2
        })
            .then(r => {
                navigate("/login")
            })
            .catch(e => notificationCtx.error("reset password", e.message))
    }

    function handlePassword1Changed(e) {
        setPassword1(e.target.value)
    }

    function handlePassword2Changed(e) {
        setPassword2(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter new password" onChange={handlePassword1Changed}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Repeat Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" onChange={handlePassword2Changed}/>
            </Form.Group>

            <Button disabled={password1 !== password2 || password1 === ""} variant="primary" type="submit">
                Reset password
            </Button>
        </Form>
    </>
}