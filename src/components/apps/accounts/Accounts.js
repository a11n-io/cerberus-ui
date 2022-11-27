
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import {AppContext} from "../AppContext";
import Account from "./Account";

export default function Accounts() {

    return <>
        <Routes>
            <Route path=":accountId/*" element={<Account/>}/>
            <Route exact path="/" element={<AccountList/>}/>
        </Routes>
    </>
}

function AccountList() {
    const [accounts, setAccounts] = useState([])
    const appCtx = useContext(AppContext)
    const {get, loading} = useFetch("/api/")
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        get("apps/"+appCtx.app.id+"/accounts")
            .then(d => {
                if (d) {
                    setAccounts(d)
                }
            })
            .catch(e => console.log(e))
    }, [])

    if (loading) {
        return <Loader/>
    }

    return <>

        <ul>
            {
                accounts.map(account => {
                    return (
                        <li className="nav-item" key={account.id}>
                            <Link to={`app/${appCtx.app.id}/accounts/${account.id}`}>{account.name}</Link>
                        </li>
                    )
                })
            }
        </ul>

    </>
}