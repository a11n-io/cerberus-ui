
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import Action from "./Action";
import CreateAction from "./CreateAction";
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import {NotificationContext} from "../../../context/NotificationContext";

export default function Actions(props) {

    const [actions, setActions] = useState([])
    const {get, loading} = useFetch("/api/")
    const [selectedAction, setSelectedAction] = useState()
    const notificationCtx = useContext(NotificationContext)
    const {resourceType} = props

    useEffect(() => {
        get("resourcetypes/"+resourceType.id+"/actions")
            .then(d => {
                if (d) {
                    setActions(d)
                }
            })
            .catch(e => {
                notificationCtx.error("get actions", e.message)
                setActions([])
            })
    }, [resourceType])


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
