import "./register.css"
import useFetch from "../../hooks/useFetch";
import {useContext, useState} from "react";
import Loader from "../../uikit/Loader";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import OAuthLogin from "../oauth/OAuthLogin";
import {NotificationContext} from "../../context/NotificationContext";

export default function Register() {
    const params = useParams()
    const navigate = useNavigate()
    const {post, loading} = useFetch("/")
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const notificationCtx = useContext(NotificationContext)

    function handleRegister(e) {
        e.preventDefault()
        post("auth/register", {
            name: name,
            email: email,
            password: password,
            hash: params.hash
        })
            .then(r => {
                navigate("/login")
            })
            .catch(e => notificationCtx.error("register", e.message))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    function handleEmailChanged(e) {
        setEmail(e.target.value)
    }

    function handlePasswordChanged(e) {
        setPassword(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Your name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" onChange={handleNameChanged}/>
            </Form.Group>

            {
                params.hash ? (<></>) : (
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={handleEmailChanged}/>
                    </Form.Group>
                )
            }

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={handlePasswordChanged}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
        <hr/>
        <OAuthLogin tokenUrl="registertoken" hash={params.hash}/>
    </>
}