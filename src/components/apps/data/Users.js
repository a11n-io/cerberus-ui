import {Button, Card, Col, Container, Form, Row, Table} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import {NotificationContext} from "../../../context/NotificationContext";
import {Confirmation, Paginator} from "@a11n-io/cerberus-reactjs";
import Loader from "../../../uikit/Loader";
import {clsx} from "clsx";

export default function Users(props) {
    const notificationCtx = useContext(NotificationContext)
    const {get, loading} = useFetch("/api/")
    const [users, setUsers] = useState([])
    const [total, setTotal] = useState(0)
    const [curPage, setCurPage] = useState(0)
    const [filter, setFilter] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)

    const {accountId} = props

    useEffect(() => {
        get(`accounts/${accountId}/users?sort=displayName&order=asc&skip=${curPage * 20}&limit=20&filter=${filter}`)
            .then(r => {
                if (r && r.page) {
                    setUsers(r.page)
                    setTotal(r.total)
                } else {
                    setUsers([])
                    setTotal(0)
                }
            })
            .catch(e => notificationCtx.error("get users", e.message))
    }, [accountId, curPage, filter])

    function handleFilterChange(e) {
        setFilter(e.target.value)
    }

    function handleUserSelected(userId) {
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(null)
        } else {
            setSelectedUser(users.find(u => u.id === userId))
        }
    }

    return <>
        <Container>
            <Row>
                <Col sm={8}>
                    <Table striped hover>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Display name</th>
                        </tr>
                        <tr>
                            <th colSpan='3'><Form.Control placeholder='filter' onChange={handleFilterChange}/></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            users.map(user => {
                                const cls = clsx({active: selectedUser === user})
                                return (
                                    <tr key={user.id} className={cls} onClick={() => handleUserSelected(user.id)}>
                                        <td>{user.id}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.displayName}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                    <Paginator
                        curPage={curPage}
                        setCurPage={setCurPage}
                        pageSize={20}
                        pageWindowSize={7}
                        total={total}
                    />
                </Col>
                <Col sm={4}>
                    <Card className='m-1'>
                        <Card.Header>
                            {
                                selectedUser
                                ? 'Update / Delete User'
                                : 'Create User'
                            }
                        </Card.Header>
                        <Card.Body>
                            {
                                selectedUser
                                    ? <User accountId={accountId} setUsers={setUsers} setSelectedUser={setSelectedUser} user={selectedUser}/>
                                    : <CreateUser accountId={accountId} setUsers={setUsers} setTotal={setTotal}/>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    </>
}

function CreateUser(props) {
    const {post, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('')
    const [displayName, setDisplayName] = useState('')

    const {accountId, setUsers, setTotal} = props

    function handleFormSubmit(e) {
        e.preventDefault()
        post(`accounts/${accountId}/users`, {
            userId: userId,
            userName: userName,
            displayName: displayName
        })
            .then(r => {
                if (r) {
                    setUsers(prev => [...prev, r].sort((a,b) => a.displayName > b.displayName))
                    setTotal(prev => prev + 1)
                }
            })
            .catch(e => notificationCtx.error("create user", e.message))
    }

    function handleUserIdChanged(e) {
        setUserId(e.target.value)
    }

    function handleUserNameChanged(e) {
        setUserName(e.target.value)
    }

    function handleDisplayNameChanged(e) {
        setDisplayName(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" >
                <Form.Label>Id</Form.Label>
                <Form.Control type="text" placeholder="Id or blank for random id" onChange={handleUserIdChanged}/>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" onChange={handleUserNameChanged}/>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label>Display name</Form.Label>
                <Form.Control type="text" placeholder="Enter display name" onChange={handleDisplayNameChanged}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Create User
            </Button>
        </Form>
    </>
}

function User(props) {
    const {put, del, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)
    const [userName, setUserName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [deletingUser, setDeletingUser] = useState('')

    const {accountId, setUsers, setSelectedUser, user} = props

    useEffect(() => {
        setUserName(user.userName)
        setDisplayName(user.displayName)
    }, [user])

    function handleFormSubmit(e) {
        e.preventDefault()
        put(`accounts/${accountId}/users/${user.id}`, {
            userName: userName,
            displayName: displayName
        })
            .then(r => {
                if (r) {
                    setUsers(prev => [...prev.filter(u => u.id !== user.id), r].sort((a,b) => a.displayName > b.displayName))
                }
            })
            .catch(e => notificationCtx.error("update user", e.message))
    }

    function handleRemoveClicked() {
        setDeletingUser(user.id)
    }

    function handleDenyDelete() {
        setDeletingUser('')
    }

    function handleConfirmDelete() {
        del(`accounts/${accountId}/users/${deletingUser}`)
            .then(d => {
                if (d) {
                    setSelectedUser(null)
                    setUsers(prev => {
                        return prev.filter(u => u.id !== user.id)
                    })
                    setDeletingUser('')
                }
            })
            .catch(e => notificationCtx.error("remove user", e.message))
    }

    function handleUserNameChanged(e) {
        setUserName(e.target.value)
    }

    function handleDisplayNameChanged(e) {
        setDisplayName(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Confirmation
            onConfirm={handleConfirmDelete}
            onDeny={handleDenyDelete}
            show={deletingUser !== ''}
            header='Delete User'
            body={`This cannot be undone. Are you sure?`}
        />
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" >
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={userName} onChange={handleUserNameChanged}/>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label>Display name</Form.Label>
                <Form.Control type="text" placeholder="Enter display name" value={displayName} onChange={handleDisplayNameChanged}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Update User
            </Button>
            <Button variant="danger" className="ms-1" onClick={handleRemoveClicked}>
                Remove User
            </Button>
        </Form>
    </>
}