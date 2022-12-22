import {Card, Col, Container, Form, Row, Tab, Table, Tabs} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../AppContext";
import useFetch from "../../../hooks/useFetch";
import {NotificationContext} from "../../../context/NotificationContext";
import {Route, Routes} from "react-router-dom";
import Resources from "./Resources";
import Users from "./Users";
import Roles from "./Roles";
import {Paginator} from "@a11n-io/cerberus-reactjs";
import {clsx} from "clsx";

export default function Accounts() {
    return <>
        <Routes>
            <Route exact path="/" element={<AccountList/>}/>
        </Routes>
    </>
}

function AccountList() {
    const appCtx = useContext(AppContext)
    const notificationCtx = useContext(NotificationContext)
    const {get, loading} = useFetch("/api/")
    const [accounts, setAccounts] = useState([])
    const [total, setTotal] = useState(0)
    const [curPage, setCurPage] = useState(0)
    const [filter, setFilter] = useState('')
    const [selectedAccount, setSelectedAccount] = useState('')

    useEffect(() => {
        get(`apps/${appCtx.app.id}/accounts?sort=id&order=asc&skip=${curPage * 20}&limit=20&filter=${filter}`)
            .then(r => {
                if (r && r.page) {
                    setAccounts(r.page)
                    setTotal(r.total)
                } else {
                    setAccounts([])
                    setTotal(0)
                }
            })
            .catch(e => notificationCtx.error("get accounts", e.message))
    }, [appCtx.app, curPage, filter])

    function handleIdFilterChange(e) {
        setFilter(e.target.value)
    }

    function handleAccountSelected(accountId) {
        if (selectedAccount === accountId) {
            setSelectedAccount('')
        } else {
            setSelectedAccount(accountId)
        }
    }

    return <>
        <Card className="mt-2">
            <Card.Header><h3>{appCtx.app.name} Accounts</h3></Card.Header>
            <Card.Body>
                <Container>
                    <Row>
                        <Col>
                            <Table striped hover>
                                <thead>
                                <tr>
                                    <th>Id</th>
                                    <th><Form.Control placeholder='filter' onChange={handleIdFilterChange}/></th>
                                    <th>Users</th>
                                    <th>Roles</th>
                                    <th>Resources</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    accounts.map(account => {
                                        const cls = clsx({active: selectedAccount === account.id})
                                        return (
                                            <tr key={account.id} className={cls} onClick={() => handleAccountSelected(account.id)}>
                                                <td colSpan='2'>{account.id}</td>
                                                <td>{account.userCount}</td>
                                                <td>{account.roleCount}</td>
                                                <td>{account.resourceCount}</td>
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
                    <Row>
                        <Col>
                            <Tabs defaultActiveKey='users'>
                                <Tab eventKey='users' title='Users'>
                                    {
                                        selectedAccount && <Users accountId={selectedAccount}/>
                                    }
                                </Tab>
                                <Tab eventKey='roles' title='Roles'>
                                    {
                                        selectedAccount && <Roles accountId={selectedAccount}/>
                                    }
                                </Tab>
                                <Tab eventKey='resources' title='Resources'>
                                    {
                                        selectedAccount && <Resources accountId={selectedAccount}/>
                                    }
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>

            </Card.Body>
        </Card>
    </>
}