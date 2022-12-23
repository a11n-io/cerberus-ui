
import {useContext, useEffect, useRef, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import Action from "./Action";
import CreateAction from "./CreateAction";
import {Col, Container, Form, ListGroup, Row} from "react-bootstrap";
import {NotificationContext} from "../../../context/NotificationContext";
import {Paginator} from "@a11n-io/cerberus-reactjs";

export default function Actions(props) {

    const {get, loading} = useFetch("/api/")
    const [selectedAction, setSelectedAction] = useState()
    const notificationCtx = useContext(NotificationContext)
    const [actions, setActions] = useState([])
    const [total, setTotal] = useState(0)
    const [curPage, setCurPage] = useState(0)
    const [filter, setFilter] = useState('')
    const filterRef = useRef(null)
    const {resourceType} = props

    useEffect(() => {
        get(`resourcetypes/${resourceType.id}/actions?sort=name&order=asc&skip=${curPage * 10}&limit=10&filter=${filter}`)
            .then(r => {
                if (r && r.page) {
                    setActions(r.page)
                    setTotal(r.total)
                } else {
                    setActions([])
                    setTotal(0)
                }
            })
            .catch(e => {
                notificationCtx.error("get actions", e.message)
            })
    }, [resourceType, curPage, filter])

    useEffect(() => {
        filterRef.current.focus()
    }, [actions])

    function handleFilterChange(e) {
        setFilter(e.target.value)
    }

    function handleActionSelected(e) {
        const actionId = e.target.getAttribute('data-val1')

        if (selectedAction !== null && selectedAction !== undefined) {
            if (selectedAction.id === actionId) {
                setSelectedAction(null)
                return
            }
        }

        setSelectedAction(actions.find((a) => a.id === actionId))
    }

    if (loading) {
        return <Loader/>
    }

    return <>

        <Container>
            <Row>
                <Col sm={6}>
                    <Form.Control placeholder='filter' ref={filterRef} onChange={handleFilterChange} value={filter} className='mb-1'/>
                    <ListGroup>
                        {actions.map((action) => {
                            return (
                                <ListGroup.Item
                                    key={action.id}
                                    action
                                    active={selectedAction && selectedAction.id === action.id}
                                    onClick={handleActionSelected}
                                    data-val1={action.id}
                                    className='d-flex justify-content-between align-items-start'
                                >
                                    <div className='ms-2 me-auto'>
                                        <div className='fw-bold' data-val1={action.id}>{action.name}</div>
                                    </div>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                    <Paginator
                        curPage={curPage}
                        setCurPage={setCurPage}
                        pageSize={10}
                        pageWindowSize={3}
                        total={total}
                    />

                </Col>
                <Col sm={6}>
                    {
                        selectedAction
                            ? <Action
                                resourceType={resourceType}
                                action={selectedAction}
                                setSelectedAction={setSelectedAction}
                                actions={actions}
                                setActions={setActions}/>
                            : <CreateAction
                                resourceType={resourceType}
                                actions={actions}
                                setActions={setActions}/>
                    }
                </Col>
            </Row>
        </Container>
    </>
}
