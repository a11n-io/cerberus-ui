
import {useContext, useEffect, useRef, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import {Routes, Route, useNavigate} from "react-router-dom";
import {AppContext} from "../AppContext";
import {Card, Col, Container, Form, ListGroup, Row} from "react-bootstrap";
import Loader from "../../../uikit/Loader";
import CreatePolicy from "./CreatePolicy";
import { ReactTree } from '@naisutech/react-tree'
import Policy from "./Policy";
import ResourceType from "../resourcetypes/ResourceType";
import CreateResourceType from "../resourcetypes/CreateResourceType";
import {NotificationContext} from "../../../context/NotificationContext";
import {Paginator} from "@a11n-io/cerberus-reactjs";

export default function Policies() {

    return <>
        <Routes>
            <Route path=":id/*" element={<Policy/>}/>
            <Route exact path="/" element={<PolicyList/>}/>
        </Routes>
    </>
}

function PolicyList() {
    const appCtx = useContext(AppContext)
    const {get, del, loading} = useFetch("/api/")
    const [selectedPolicy, setSelectedPolicy] = useState()
    const notificationCtx = useContext(NotificationContext)
    const [policies, setPolicies] = useState([])
    const [total, setTotal] = useState(0)
    const [curPage, setCurPage] = useState(0)
    const [filter, setFilter] = useState('')
    const filterRef = useRef(null)

    useEffect(() => {
        get(`apps/${appCtx.app.id}/policies?sort=name&order=asc&skip=${curPage * 10}&limit=10&filter=${filter}`)
            .then(r => {
                if (r && r.page) {
                    setPolicies(r.page)
                    setTotal(r.total)
                } else {
                    setPolicies([])
                    setTotal(0)
                }
            })
            .catch(e => {
                notificationCtx.error("get policies", e.message)
                setPolicies([])
            })
    }, [appCtx.app, curPage, filter])

    useEffect(() => {
        filterRef.current.focus()
    }, [policies])

    function handleFilterChange(e) {
        setFilter(e.target.value)
    }

    function handlePolicySelected(e) {
        const policyId = e.target.getAttribute('data-val1')

        if (selectedPolicy !== null && selectedPolicy !== undefined) {
            if (selectedPolicy.id === policyId) {
                setSelectedPolicy(null)
                return
            }
        }

        setSelectedPolicy(policies.find((p) => p.id === policyId))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Card className="mt-2">
            <Card.Header><h1>{appCtx.app.name} Policies</h1></Card.Header>
            <Card.Body>
                <Container>
                    <Row>
                        <Col sm={4}>
                            <Form.Control placeholder='filter' ref={filterRef} onChange={handleFilterChange} value={filter} className='mb-1'/>
                            <ListGroup>
                                {policies.map((policy) => {
                                    return (
                                        <ListGroup.Item
                                            key={policy.id}
                                            action
                                            active={selectedPolicy && selectedPolicy.id === policy.id}
                                            onClick={handlePolicySelected}
                                            data-val1={policy.id}
                                            className='d-flex justify-content-between align-items-start'
                                        >
                                            <div className='ms-2 me-auto'>
                                                <div className='fw-bold' data-val1={policy.id}>{policy.name}</div>
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
                        <Col sm={8}>
                            {
                                selectedPolicy
                                    ? <Policy
                                        policy={selectedPolicy}
                                        setSelectedPolicy={setSelectedPolicy}
                                        policies={policies}
                                        setPolicies={setPolicies}/>
                                    : <CreatePolicy
                                        policies={policies}
                                        setPolicies={setPolicies}/>
                            }
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    </>
}
