
import {useContext, useEffect} from "react";
import {AuthContext} from "../../context/AuthContext";
import {CerberusContext} from "@a11n-io/cerberus-reactjs";
import {useNavigate} from "react-router-dom";
import {NotificationContext} from "../../context/NotificationContext";
import OAuth2Login from "react-simple-oauth2-login"
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import './OAuthLogin.css'

export default function OAuthLogin(props) {

    const auth = useContext(AuthContext)
    const cerberusCtx = useContext(CerberusContext)
    const navigate = useNavigate()
    const notificationCtx = useContext(NotificationContext)
    const {post, loading} = useFetch("/")

    function onGoogleSuccess(code) {
        post(`oauth/google/logintoken?code=${code.code}&client_id=877652437993-vona3ljjsvsshf0872krlum94oe3qo2t.apps.googleusercontent.com&redirect_uri=${document.location.origin}/callback`)
            .then(r => {
                auth.login(r)
                navigate("/")
            })
            .catch(e => notificationCtx.error("oauth", e.message))
    }

    function onLinkedinSuccess(code) {
        post(`oauth/linkedin/logintoken?code=${code.code}&client_id=78y898ongwju70&redirect_uri=${document.location.origin}/callback`)
            .then(r => {
                auth.login(r)
                navigate("/")
            })
            .catch(e => notificationCtx.error("oauth", e.message))
    }

    function onError(e) {
        notificationCtx.error("oauth", e)
    }

    if (loading) {
        return <Loader />
    }

    return <>
        <p>Or :</p>

        <OAuth2Login
            authorizationUrl="https://accounts.google.com/o/oauth2/v2/auth"
            clientId="877652437993-vona3ljjsvsshf0872krlum94oe3qo2t.apps.googleusercontent.com"
            redirectUri={`${document.location.origin}/callback`}
            responseType="code"
            scope="https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
            onSuccess={onGoogleSuccess}
            onFailure={onError}
            className="login m-2"
        >
            <div className="google_login_btn">
                <span className="icon"></span>
                <span className="buttonText">Sign in with Google</span>
            </div>

        </OAuth2Login>

        <OAuth2Login
            authorizationUrl="https://www.linkedin.com/oauth/v2/authorization"
            clientId="78y898ongwju70"
            redirectUri={`${document.location.origin}/callback`}
            responseType="code"
            scope="r_emailaddress r_liteprofile"
            onSuccess={onLinkedinSuccess}
            onFailure={onError}
            className="login m-2"
        >
            <div className="linkedin_login_btn">
                <span className="icon"></span>
                <span className="buttonText">Sign in with Linkedin</span>
            </div>
        </OAuth2Login>
    </>
}