
import { useOAuth2 } from "@a11n-io/react-use-oauth2";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../context/AuthContext";
import {CerberusContext} from "cerberus-reactjs";
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import {NotificationContext} from "../../context/NotificationContext";

export default function OAuthLogin(props) {

    const auth = useContext(AuthContext)
    const cerberusCtx = useContext(CerberusContext)
    const navigate = useNavigate()
    const notificationCtx = useContext(NotificationContext)

    const {tokenUrl, hash} = props
    let exchangeUrl = process.env.REACT_APP_WEB_HOST + tokenUrl

    if (hash) {
        exchangeUrl = exchangeUrl + "?hash="+hash
    }

    const { data: google_data, loading: google_loading, error: google_error, getAuth: google_getAuth, logout: google_logout } = useOAuth2({
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        clientId: "877652437993-vona3ljjsvsshf0872krlum94oe3qo2t.apps.googleusercontent.com",
        redirectUri: `${document.location.origin}/callback`,
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        responseType: "code",
        exchangeCodeForTokenServerURL: exchangeUrl,
        exchangeCodeForTokenMethod: "POST",
        onSuccess: (payload) => handleOAuthPayload(payload),
        onError: (error_) => notificationCtx.error("oauth", error_)
    });

    const { data: linkedin_data, loading: linkedin_loading, error: linkedin_error, getAuth: linkedin_getAuth, logout: linkedin_logout } = useOAuth2({
        authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
        clientId: "78y898ongwju70",
        redirectUri: `${document.location.origin}/callback`,
        scope: "r_emailaddress r_liteprofile",
        responseType: "code",
        exchangeCodeForTokenServerURL: exchangeUrl,
        exchangeCodeForTokenMethod: "POST",
        onSuccess: (payload) => handleOAuthPayload(payload),
        onError: (error_) => notificationCtx.error("oauth", error_)
    });

    useEffect(() => {
        if (auth) {
            auth.setLogouts(prev => [...prev.filter(p => p.provider !== "linkedin"), {provider: "linkedin", logout: linkedin_logout()}])
        }
    }, [linkedin_logout])

    useEffect(() => {
        if (auth) {
            auth.setLogouts(prev => [...prev.filter(p => p.provider !== "google"), {provider: "google", logout: google_logout()}])
        }
    }, [google_logout])

    function handleOAuthPayload(payload) {
        if (payload.data) {
            auth.setUser(payload.data)
            cerberusCtx.setApiToken(payload.data.token)
            navigate("/")
        }
    }

    return <>
        <p>Or, sign in with:</p>
        <Button variant="danger" onClick={google_getAuth} className="m-2"><span className="fa fa-google m-1"/>Google</Button>
        <Button variant="primary" onClick={linkedin_getAuth} className="m-2"><span className="fa fa-linkedin m-1"/>Linkedin</Button>
    </>
}