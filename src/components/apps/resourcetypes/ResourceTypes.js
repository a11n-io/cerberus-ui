
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import {AppContext} from "../AppContext";
import ResourceType from "./ResourceType";
import CreateResourceType from "./CreateResourceType";
import {Button, Card, Col, Container, ListGroup, Row, Table} from "react-bootstrap";
import {ReactTree} from "@naisutech/react-tree";
import Policy from "../policies/Policy";
import CreatePolicy from "../policies/CreatePolicy";
import {NotificationContext} from "../../../context/NotificationContext";

export default function ResourceTypes() {

    return <>
        <Routes>
            <Route path=":id/*" element={<ResourceType/>}/>
            <Route exact path="/" element={<ResourceTypeList/>}/>
        </Routes>
    </>
}

function ResourceTypeList() {
    const [resourceTypes, setResourceTypes] = useState([])
    const appCtx = useContext(AppContext)
    const {get, loading} = useFetch("/api/")
    const [selectedResourceType, setSelectedResourceType] = useState()
    const notificationCtx = useContext(NotificationContext)

    const resourceTypeTree = buildResourceTypeTree()

    useEffect(() => {
        get("apps/"+appCtx.app.id+"/resourcetypes")
            .then(d => {
                if (d) {
                    setResourceTypes(d)
                }
            })
            .catch(e => {
                notificationCtx.error("get resource types", e.message)
                setResourceTypes([])
            })
    }, [])

    function buildResourceTypeTree() {
        return resourceTypes.map(rt => {
            return {...rt, label: rt.name, parentId: (rt.parentId === "" ? null : rt.parentId)}
        })
    }

    function handleResourceTypeSelected(selected) {
        if (selected.length === 0) {
            setSelectedResourceType(null)
            return
        }
        setSelectedResourceType(() => resourceTypes.find(rt => rt.id === selected[0]))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Card className="mt-2">
            <Card.Header><h1>{appCtx.app.name} Resource Types</h1></Card.Header>
            <Card.Body>
                <Container>
                    <Row>
                        <Col sm={4}>
                            <ReactTree nodes={resourceTypeTree} onToggleSelectedNodes={handleResourceTypeSelected}/>
                        </Col>
                        <Col sm={8}>
                            {
                                selectedResourceType
                                    ? <ResourceType
                                        resourceType={selectedResourceType}
                                        setSelectedResourceType={setSelectedResourceType}
                                        resourceTypes={resourceTypes}
                                        setResourceTypes={setResourceTypes}/>
                                    : <CreateResourceType
                                        resourceTypes={resourceTypes}
                                        setResourceTypes={setResourceTypes}/>
                            }
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    </>
}