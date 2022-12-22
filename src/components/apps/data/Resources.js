import {Button, Card, Col, Container, Form, Pagination, Row, Table} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import {NotificationContext} from "../../../context/NotificationContext";
import {Paginator} from "@a11n-io/cerberus-reactjs";
import {clsx} from "clsx";
import Loader from "../../../uikit/Loader";

export default function Resources(props) {
    const notificationCtx = useContext(NotificationContext)
    const {get, loading} = useFetch("/api/")
    const [resources, setResources] = useState([])
    const [total, setTotal] = useState(0)
    const [curPage, setCurPage] = useState(0)
    const [filter, setFilter] = useState('')
    const [selectedResource, setSelectedResource] = useState(null)

    const {accountId} = props

    useEffect(() => {
        get(`accounts/${accountId}/resources?sort=id&order=asc&skip=${curPage * 20}&limit=20&filter=${filter}`)
            .then(r => {
                if (r && r.page) {
                    setResources(r.page)
                    setTotal(r.total)
                } else {
                    setResources([])
                    setTotal(0)
                }
            })
            .catch(e => {
                notificationCtx.error("get resources", e.message)
            })
    }, [accountId, curPage, filter])

    function handleIdFilterChange(e) {
        setFilter(e.target.value)
    }

    function handleResourceSelected(resourceId) {
        if (selectedResource && selectedResource.id === resourceId) {
            setSelectedResource(null)
        } else {
            setSelectedResource(resources.find(r => r.id === resourceId))
        }
    }

    return <>
        <Container>
            <Row>
                <Col sm={12}>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Type</th>
                            </tr>
                            <tr>
                                <th><Form.Control placeholder='filter' onChange={handleIdFilterChange}/></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            resources.map(resource => {
                                const cls = clsx({active: selectedResource === resource})
                                return (
                                    <tr key={resource.id} className={cls} onClick={() => handleResourceSelected(resource.id)}>
                                        <td>{resource.id}</td>
                                        <td>{resource.resourceTypeName}</td>
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
            </Row>
        </Container>
    </>
}
