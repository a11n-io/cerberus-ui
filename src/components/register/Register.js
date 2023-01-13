import "./register.css"
import useFetch from "../../hooks/useFetch";
import React, {useContext, useState} from "react";
import Loader from "../../uikit/Loader";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Alert, Button, Form} from "react-bootstrap";
import OAuthLogin from "../oauth/OAuthLogin";
import {NotificationContext} from "../../context/NotificationContext";

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Register() {
    const params = useParams()
    const query = useQuery()
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

        {
            query.get("message") && <Alert variant="success" className="m-2">
                <Alert.Heading>
                    {query.get("heading")}
                </Alert.Heading>
                <p>{query.get("message")}</p>
            </Alert>
        }

        {
            !params.hash && <Alert variant="warning" className="m-2">
                <Alert.Heading>
                    Choose a plan first
                </Alert.Heading>
                <p>Please choose a <a href="https://a11n.io/index.html#pricing" target="_self">subscription plan</a> before registering</p>
            </Alert>
        }

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