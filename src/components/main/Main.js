import {Route, Routes} from "react-router-dom";
import Apps from "../apps/Apps";
import {Button, Card, Form, ListGroup, Tab, Tabs, Toast} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {CerberusContext, Permissions, Roles, Users} from "@a11n-io/cerberus-reactjs";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import {NotificationContext} from "../../context/NotificationContext";

export default function Main() {

    return <>
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="settings" element={<Settings/>}/>
            <Route path="/apps/*" element={<Apps/>}/>
        </Routes>
    </>
}

function Home () {
    return <>
        <Card className="mt-2">
            <Card.Header><h1>Cerberus Dashboard</h1></Card.Header>
            <Card.Body>
                Manage your Cerberus apps and their settings here
            </Card.Body>
        </Card>
    </>
}

function Settings () {
    const auth = useContext(AuthContext)
    const notificationCtx = useContext(NotificationContext)

    function handlePermissionsError(e) {
        notificationCtx.error('permissions', e.message)
    }

    function handleUsersError(e) {
        notificationCtx.error('users', e.message)
    }

    function handleRolesError(e) {
        notificationCtx.error('roles', e.message)
    }

    return <>
        <Card className="mt-2">
            <Card.Header><h1>Cerberus Settings</h1></Card.Header>
            <Card.Body>
                <Tabs defaultActiveKey='users' className='mb-3'>
                    <Tab eventKey='users' title='Users'>
                        <Users NoUserSelectedComponent={Invitations} onError={handleUsersError}/>
                    </Tab>
                    <Tab eventKey='roles' title='Roles'>
                        <Roles onError={handleRolesError}/>
                    </Tab>
                    <Tab eventKey='permissions' title='Permissions'>
                        <Permissions resourceId={auth.user.accountId} changeAction="ManageAccountPermissions" onError={handlePermissionsError}/>
                    </Tab>
                    <Tab eventKey='account' title='Account'>
                        <Account />
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    </>
}

function Invitations() {

    const { get, put, del, loading } = useFetch('/api/')
    const [invitations, setInvitations] = useState([])
    const notificationCtx = useContext(NotificationContext)

    useEffect(() => {
        get(`invitations`)
            .then(r => setInvitations(r))
            .catch(e => notificationCtx.error("get invitations", e.message))
    }, [])

    function handleInvitationResendClicked(e) {
        const invitationId = e.target.getAttribute('data-val1')

        put(`invitations/${invitationId}`)
            .then(r => {})
            .catch(e => notificationCtx.error("resend invitation", e.message))
    }

    function handleInvitationRevokeClicked(e) {
        const invitationId = e.target.getAttribute('data-val1')

        del(`invitations/${invitationId}`)
            .then(r => {
                setInvitations((prev) => prev.filter(i => i.id !== invitationId))
            })
            .catch(e => notificationCtx.error("revoke invitation", e.message))
    }

    return <>
        <Card className="mb-5">
            <Card.Header>User Invitations</Card.Header>
            <Card.Body>
                <ListGroup>
                    {
                        invitations.map(invitation => {
                            return (
                                <ListGroup.Item
                                    key={invitation.id}
                                    className='d-flex justify-content-between align-items-start'>
                                    <span className='ms-2 me-auto'>
                                        <div className='fw-bold'>{invitation.email}</div>
                                        <div>on {new Date(invitation.invitationDate * 1000).toDateString()}</div>
                                    </span>
                                    <Button data-val1={invitation.id} onClick={handleInvitationResendClicked} className="mr-5">Resend</Button>
                                    <Button data-val1={invitation.id} onClick={handleInvitationRevokeClicked} variant="danger">Revoke</Button>
                                </ListGroup.Item>
                            )
                        })
                    }
                </ListGroup>
            </Card.Body>
        </Card>
        <Card>
            <Card.Header>Invite User</Card.Header>
            <Card.Body><InviteUser setInvitations={setInvitations}/></Card.Body>
        </Card>
    </>
}

function InviteUser(props) {
    const { get, post, loading } = useFetch('/api/')
    const [email, setEmail] = useState("")
    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState("")
    const notificationCtx = useContext(NotificationContext)

    const {setInvitations} = props

    useEffect(() => {
        get(`roles`)
            .then(r => setRoles(r))
            .catch(e => notificationCtx.error("get roles", e.message))
    }, [])

    function handleEmailChanged(e) {
        setEmail(e.target.value)
    }

    function handleRoleSelected(e) {
        setSelectedRole(e.target.value)
    }

    function handleFormSubmit(e) {
        e.preventDefault()
        post('invitations', {
            email: email,
            roleId: selectedRole
        })
            .then((r) => {
                setInvitations(prev => [...prev, r])
            })
            .catch((e) => notificationCtx.error("send invitation", e.message))
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter email'
                        onChange={handleEmailChanged}
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Role</Form.Label>
                    <Form.Select onChange={handleRoleSelected}>
                        <option value="">Select a role</option>
                        {
                            roles.map(role => {
                                return (
                                    <option key={role.id} value={role.id}>{role.displayName}</option>
                                )
                            })
                        }
                    </Form.Select>
                </Form.Group>
                <Button disabled={email === "" || selectedRole === ""} variant='primary' type='submit'>
                    Invite
                </Button>
            </Form>
        </>
    )
}

function Account() {
    return <>
    acc
    </>
}