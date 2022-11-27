import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import {NotificationContext} from "../../context/NotificationContext";

export default function VerifyEmail() {
    const params = useParams()
    const {post, loading} = useFetch("/")
    const [verified, setVerified] = useState(false)
    const notificationCtx = useContext(NotificationContext)

    useEffect(() => {
        post(`auth/verifyemail/${params.hash}`)
            .then(r => {
                setVerified(true)
            })
            .catch(e => notificationCtx.error("verify email", e.message))
    }, [params])

    if (loading) {
        return <Loader/>
    }

    return <>
        {
            verified ? <Verified/> : <NotVerified/>
        }
    </>
}

function Verified() {

    return <>
        <h1>Email Verified</h1>
        <p>Thank you for completing verification, you can now <Link to="/login">Log in</Link></p>
    </>
}

function NotVerified() {
    return <>
        <h1>Verification failed</h1>
    </>
}