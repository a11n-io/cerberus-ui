import "./login.css"
import useFetch from "../../hooks/useFetch";
import {Link, useNavigate} from "react-router-dom";
import Loader from "../../uikit/Loader";
import {useContext, useEffect, useState} from "react";
import {encode} from "base-64"
import {AuthContext} from "../../context/AuthContext";
import {Button, Form} from "react-bootstrap";
import {CerberusContext} from "cerberus-reactjs";
import OAuthLogin from "../oauth/OAuthLogin";
import {NotificationContext} from "../../context/NotificationContext";

export default function Login() {
    const auth = useContext(AuthContext)
    const cerberusCtx = useContext(CerberusContext)
    const navigate = useNavigate()
    const {post, loading} = useFetch("/")
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const notificationCtx = useContext(NotificationContext)

    function handleLogin(e) {
        e.preventDefault()

        const basicAuth = "Basic " + encode(email+":"+password)

        post("auth/login", {
            email: email,
            password: password
        }, {"Authorization": basicAuth})
            .then(r => {
                auth.setUser(r)
                cerberusCtx.setApiAccessToken(r.token)
                cerberusCtx.setApiRefreshToken(r.refreshToken)
                navigate("/")
            })
            .catch(e => notificationCtx.error("login", e.message))
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
        <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={handleEmailChanged}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={handlePasswordChanged}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
        <div><Link to="/register">Register</Link></div>
        <div><Link to="/forgotpassword">Forgot password</Link></div>
        <hr/>
        <OAuthLogin tokenUrl="logintoken"/>
    </>
}