import {Route, Routes} from "react-router-dom";
import Apps from "../apps/Apps";
import {Button, Card, Form, ListGroup, Tab, Tabs, Toast} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {Confirmation, Permissions, Roles, Users} from "@a11n-io/cerberus-reactjs";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import {NotificationContext} from "../../context/NotificationContext";
import jwt_decode from "jwt-decode";
import "@a11n-io/cerberus-reactjs/dist/index.css"

export default function Main() {
    // const authCtx = useContext(AuthContext)
    // const [decoded, setDecoded] = useState('')
    //
    // useEffect(() => {
    //     setDecoded(jwt_decode(authCtx.user.tokenPair.accessToken))
    //     console.log(decoded)
    // }, [authCtx.user])
    //
    // if (decoded && decoded[decoded['sub']]['stripeCustId'] === '') {
    //     return <>
    //         Please activate your subscription here.
    //         Make sure to use '{decoded[decoded['sub']]['email']}' as your email.
    //
    //         <stripe-pricing-table pricing-table-id="prctbl_1MP7SQIO2n4JFgB7RTcBLnw2"
    //                               publishable-key="pk_test_44OK1AQNun4SXTsrqJsCoIOp">
    //         </stripe-pricing-table>
    //     </>
    // }

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
    const [deletingInvitation, setDeletingInvitation] = useState('')

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
        setDeletingInvitation(invitationId)
    }

    function handleDenyDelete() {
        setDeletingInvitation('')
    }

    function handleConfirmDelete() {
        del(`invitations/${deletingInvitation}`)
            .then(r => {
                setInvitations((prev) => prev.filter(i => i.id !== deletingInvitation))
                setDeletingInvitation('')
            })
            .catch(e => notificationCtx.error("revoke invitation", e.message))
    }

    return <>
        <Confirmation
            onConfirm={handleConfirmDelete}
            onDeny={handleDenyDelete}
            show={deletingInvitation !== ''}
            header='Delete Invitation'
            body={`This will invalidate the invitation previously sent, but you can always send another one. Are you sure?`}
        />
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
    const auth = useContext(AuthContext)

    const {setInvitations} = props

    useEffect(() => {
        get(`accounts/${auth.user.accountId}/roles`)
            .then(r => {
                if (r && r.page) {
                    setRoles(r.page)
                } else {
                    setRoles([])
                }
            })
            .catch(e => notificationCtx.error("get roles", e.message))
    }, [auth.user])

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
    const notificationCtx = useContext(NotificationContext)
    const authCtx = useContext(AuthContext)
    const { del, post, loading } = useFetch('/api/')
    const [deletingAccount, setDeletingAccount] = useState('')

    function handleDeleteClicked() {
        setDeletingAccount(authCtx.user.accountId)
    }

    function handleDenyDelete() {
        setDeletingAccount('')
    }

    function handleConfirmDelete() {
        del(`accounts/${deletingAccount}`)
            .then(r => {
                setDeletingAccount('')
                authCtx.logout()
            })
            .catch(e => notificationCtx.error("delete account", e.message))
    }

    function handleBillingClicked() {
        post(`accounts/${authCtx.user.accountId}/billing`)
            .then(r => {
                window.location.href = r
            })
            .catch(e => notificationCtx.error("billing", e.message))
    }
    if (loading) {
        return <Loader />
    }

    return <>
        <Confirmation
            onConfirm={handleConfirmDelete}
            onDeny={handleDenyDelete}
            show={deletingAccount !== ''}
            header='Delete Account'
            body={`This cannot be undone and will delete all users, apps, accounts and data for the account.
            Type "delete account" if you are sure.`}
            test={`delete account`}
        />

        {/*<Button variant="danger" className="ms-1" onClick={handleDeleteClicked}>*/}
        {/*    Delete Account*/}
        {/*</Button>*/}

        <Button variant="primary" onClick={handleBillingClicked}>Manage billing</Button>
    </>
}