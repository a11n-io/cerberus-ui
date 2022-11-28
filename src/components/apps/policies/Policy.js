
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import {AppContext} from "../AppContext";
import Form from 'react-bootstrap/Form';
import {Button, Card, Col, Container, Row, Tab, Tabs} from "react-bootstrap";
import {ReactTree} from "@naisutech/react-tree";
import {AuthContext} from "../../../context/AuthContext";
import {NotificationContext} from "../../../context/NotificationContext";

export default function Policy(props) {

    const {policy, setSelectedPolicy, policies, setPolicies} = props

    return <>

        <Dashboard policy={policy} setSelectedPolicy={setSelectedPolicy} policies={policies} setPolicies={setPolicies}/>

    </>
}


function Dashboard(props) {
    const auth = useContext(AuthContext)
    const appCtx = useContext(AppContext)
    const [resourceTypes, setResourceTypes] = useState([])
    const {get, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    const {policy, setSelectedPolicy, policies, setPolicies} = props

    useEffect(() => {

        get("apps/"+appCtx.app.id+"/policies/"+policy.id+"/resourcetypes")
            .then(d => {
                if (d) {
                    setResourceTypes(d)
                }
            })
            .catch(e => notificationCtx.error("get policy resource types", e.message))
    }, [appCtx, policy])

    return <>

        <Card>
            <Card.Header>
                <h2>Policy: {policy.name}</h2>
            </Card.Header>
            <Card.Body>
                <Tabs
                    defaultActiveKey="actions"
                    className="mb-3"
                >
                    <Tab eventKey="actions" title="Actions">
                        <Actions policy={policy} resourceTypes={resourceTypes} setResourceTypes={setResourceTypes}/>
                    </Tab>
                    <Tab eventKey="details" title="Details">
                        <Details policy={policy} setSelectedPolicy={setSelectedPolicy} setPolicies={setPolicies}/>
                    </Tab>
                    {/*<Tab eventKey="permissions" title="Permissions">*/}
                    {/*    <Permissions resourceId={policy.id} />*/}
                    {/*</Tab>*/}
                </Tabs>

            </Card.Body>
        </Card>

    </>
}

function Details(props) {
    const appCtx = useContext(AppContext)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const {put, del, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    const {policy, setSelectedPolicy, setPolicies} = props

    useEffect(() => {
        setName(policy.name)
        setDescription(policy.description)

    }, [policy])

    function handleFormSubmit(e) {
        e.preventDefault()
        put(`apps/${appCtx.app.id}/policies/${policy.id}`, {
            name: name,
            description: description,
            parentId: policy.parentId
        })
            .then(r => {
                if (r) {
                    setPolicies(prev => [...prev.filter(p => p.id !== r.id), r])
                }
            })
            .catch(e => notificationCtx.error("update policy", e.message))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    function handleDescriptionChanged(e) {
        setDescription(e.target.value)
    }


    function handleRemoveClicked() {

        del(`apps/${appCtx.app.id}/policies/${policy.id}`)
            .then(d => {
                if (d) {
                    setSelectedPolicy(null)
                    setPolicies(prev => {
                        return prev.filter(p => p.id !== policy.id)
                    })
                }
            })
            .catch(e => notificationCtx.error("remove policy", e.message))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" >
                <Form.Label>Policy name</Form.Label>
                <Form.Control type="text" value={name} placeholder="Enter policy name" onChange={handleNameChanged}/>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label>Policy description</Form.Label>
                <Form.Control type="text" value={description} placeholder="Enter policy description" onChange={handleDescriptionChanged}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Update
            </Button>
            <Button variant="danger" className="ms-1" onClick={handleRemoveClicked}>
                Remove
            </Button>

        </Form>
    </>
}

function Actions(props) {
    const [selectedResourceType, setSelectedResourceType] = useState()
    const [actionsMap, setActionsMap] = useState([])
    const [actions, setActions] = useState([])
    const {get, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)

    const {policy, resourceTypes, setResourceTypes} = props
    const resourceTypeTree = buildResourceTypeTree()

    useEffect(() => {
        resourceTypes.forEach(rt => {
            get("resourcetypes/"+rt.id+"/policies/"+policy.id+"/actions")
                .then(d => {
                    if (d) {
                        setActionsMap(prev => {
                            return [...prev.filter(am => am.rtid !== rt.id), {rtid: rt.id, actions: d}]
                        })
                    }
                })
                .catch(e => {
                    notificationCtx.error("get policy actions", e.message)
                })
        })
    }, [policy, resourceTypes])

    useEffect(() => {

        if (selectedResourceType) {
            const map = actionsMap.find(m => m.rtid === selectedResourceType.id)
            if (map && map.actions) {
                setActions(map.actions)
            }
        }
    }, [actionsMap])

    function buildResourceTypeTree() {
        return resourceTypes.map(rt => {
            const label = rt.actionCount > 0 ? `${rt.name} (${rt.actionCount})` : `${rt.name}`
            return {...rt, label: label, parentId: (!rt.parentId || rt.parentId === "" ? null : rt.parentId)}
        })
    }

    function handleResourceTypeSelected(selected) {
        if (selected.length === 0) {
            setSelectedResourceType(null)
            setActions([])
            return
        }

        setSelectedResourceType(resourceTypes.find(rt => rt.id === selected[0]))

        const map = actionsMap.find(m => m.rtid === selected[0])
        if (map && map.actions) {
            setActions(map.actions)
        }
    }

    function updateActionsMap(rtid, actions) {
        setActions(prev => [...actions.sort((a, b) => a.name > b.name)])
        setActionsMap(prev => {
            return [...prev.filter(m => m.rtid !== rtid), {rtid:rtid, actions:actions}]
        })
    }
    return <>
        <Container>
            <Row>
                <Col>
                    <ReactTree nodes={resourceTypeTree} onToggleSelectedNodes={handleResourceTypeSelected}/>
                </Col>
                <Col>
                    {
                        selectedResourceType && <ResourceActions
                            policy={policy}
                            resourceType={selectedResourceType}
                            resourceTypes={resourceTypes}
                            setResourceTypes={setResourceTypes}
                            actions={actions}
                            updateActionsMap={updateActionsMap}/>
                    }
                </Col>
            </Row>
        </Container>
    </>
}

function ResourceActions(props) {

    const {get, post, del, loading} = useFetch("/api/")
    const notificationCtx = useContext(NotificationContext)
    const {policy, resourceType, resourceTypes, setResourceTypes, actions, updateActionsMap} = props

    function handleActionToggled(e) {

        const selected = actions.find(a => a.id === e.target.value)
        if (!selected) {
            return
        }

        if (selected.inPolicy === false) {
            post(`resourcetypes/${resourceType.id}/actions/${selected.id}/policies/${policy.id}`)
                .then(d => {
                    updateActionsMap(resourceType.id, [...actions.filter(a => a.id !== selected.id), d])
                    setResourceTypes([...resourceTypes.map(rt => {
                        if (rt.id === resourceType.id) {
                            return {...rt, actionCount: (rt.actionCount + 1)}
                        }
                        return rt
                    })])
                })
                .catch(e => notificationCtx.error("add policy action", e.message))
        } else {
            del(`resourcetypes/${resourceType.id}/actions/${selected.id}/policies/${policy.id}`)
                .then(d => {
                    updateActionsMap(resourceType.id, [...actions.filter(a => a.id !== selected.id), d])
                    setResourceTypes([...resourceTypes.map(rt => {
                        if (rt.id === resourceType.id) {
                            return {...rt, actionCount: (rt.actionCount - 1)}
                        }
                        return rt
                    })])
                })
                .catch(e => notificationCtx.error("remove policy action", e.message))
        }
    }

    if (loading) {
        return <Loader/>
    }

    return <>

        <Form>
            {
                actions.map(a => {
                    return (
                        <Form.Switch
                            key={a.id}
                            id={`action-switch-${a.id}`}
                            label={a.name}
                            checked={a.inPolicy}
                            value={a.id}
                            onChange={handleActionToggled}
                        />
                    )
                })
            }
        </Form>
    </>
}
