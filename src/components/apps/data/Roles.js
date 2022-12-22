import {Button, Card, Col, Container, Form, Row, Table} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import {NotificationContext} from "../../../context/NotificationContext";
import {Confirmation, Paginator} from "@a11n-io/cerberus-reactjs";
import {clsx} from "clsx";
import Loader from "../../../uikit/Loader";

export default function Resources(props) {
    const notificationCtx = useContext(NotificationContext)
    const {get, del, put, post, loading} = useFetch("/api/")
    const [roles, setRoles] = useState([])
    const [total, setTotal] = useState(0)
    const [curPage, setCurPage] = useState(0)
    const [filter, setFilter] = useState('')
    const [selectedRole, setSelectedRole] = useState(null)

    const {accountId} = props

    useEffect(() => {
        get(`accounts/${accountId}/roles?sort=displayName&order=asc&skip=${curPage * 20}&limit=20&filter=${filter}`)
            .then(r => {
                if (r && r.page) {
                    setRoles(r.page)
                    setTotal(r.total)
                } else {
                    setRoles([])
                    setTotal(0)
                }
            })
            .catch(e => notificationCtx.error("get roles", e.message))
    }, [accountId, curPage, filter])

    function handleFilterChange(e) {
        setFilter(e.target.value)
    }

    function handleRoleSelected(roleId) {
        if (selectedRole && selectedRole.id === roleId) {
            setSelectedRole(null)
        } else {
            setSelectedRole(roles.find(r => r.id === roleId))
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
                                <th>Name</th>
                                <th></th>
                            </tr>
                            <tr>
                                <th colSpan='2'><Form.Control placeholder='filter' onChange={handleFilterChange}/></th>
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            roles.map(role => {
                                const cls = clsx({active: selectedRole === role})
                                return (
                                    <tr key={role.id} className={cls} onClick={() => handleRoleSelected(role.id)}>
                                        <td>{role.id}</td>
                                        <td>{role.name}</td>
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
                                selectedRole
                                    ? 'Update / Delete Role'
                                    : 'Create Role'
                            }
                        </Card.Header>
                        <Card.Body>
                            {
                                selectedRole
                                    ? <Role accountId={accountId} setRoles={setRoles} setSelectedRole={setSelectedRole} role={selectedRole}/>
                                    : <CreateRole accountId={accountId} setRoles={setRoles} setTotal={setTotal}/>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>
}

function CreateRole(props) {
    const {post, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)
    const [roleId, setRoleId] = useState('')
    const [name, setName] = useState('')

    const {accountId, setRoles, setTotal} = props

    function handleFormSubmit(e) {
        e.preventDefault()
        post(`accounts/${accountId}/roles`, {
            roleId: roleId,
            name: name,
        })
            .then(r => {
                if (r) {
                    setRoles(prev => [...prev, r].sort((a,b) => a.name > b.name))
                    setTotal(prev => prev + 1)
                }
            })
            .catch(e => notificationCtx.error("create role", e.message))
    }

    function handleRoleIdChanged(e) {
        setRoleId(e.target.value)
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" >
                <Form.Label>Id</Form.Label>
                <Form.Control type="text" placeholder="Id or blank for random id" onChange={handleRoleIdChanged}/>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label>Role name</Form.Label>
                <Form.Control type="text" placeholder="Enter role name" onChange={handleNameChanged}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Create Role
            </Button>
        </Form>
    </>
}

function Role(props) {
    const {put, del, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)
    const [name, setName] = useState('')
    const [deletingRole, setDeletingRole] = useState('')

    const {accountId, setRoles, setSelectedRole, role} = props

    useEffect(() => {
        setName(role.name)
    }, [role])

    function handleFormSubmit(e) {
        e.preventDefault()
        put(`accounts/${accountId}/roles/${role.id}`, {
            name: name
        })
            .then(r => {
                if (r) {
                    setRoles(prev => [...prev.filter(r => r.id !== role.id), r].sort((a,b) => a.name > b.name))
                }
            })
            .catch(e => notificationCtx.error("update role", e.message))
    }

    function handleRemoveClicked() {
        setDeletingRole(role.id)
    }

    function handleDenyDelete() {
        setDeletingRole('')
    }

    function handleConfirmDelete() {
        del(`accounts/${accountId}/roles/${deletingRole}`)
            .then(d => {
                if (d) {
                    setSelectedRole(null)
                    setRoles(prev => {
                        return prev.filter(r => r.id !== role.id)
                    })
                    setDeletingRole('')
                }
            })
            .catch(e => notificationCtx.error("remove role", e.message))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Confirmation
            onConfirm={handleConfirmDelete}
            onDeny={handleDenyDelete}
            show={deletingRole !== ''}
            header='Delete Role'
            body={`This cannot be undone. Are you sure?`}
        />
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" >
                <Form.Label>Role name</Form.Label>
                <Form.Control type="text" placeholder="Enter role name" value={name} onChange={handleNameChanged}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Update Role
            </Button>
            <Button variant="danger" className="ms-1" onClick={handleRemoveClicked}>
                Remove Role
            </Button>
        </Form>
    </>
}