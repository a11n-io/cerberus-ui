import {useContext} from "react";
import {AuthContext, AuthGuard} from "../../context/AuthContext";
import {useNavigate, Link, NavLink} from "react-router-dom";

export default function Navbar() {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    function handleLogout() {
        auth.logout()
        navigate("/login")
    }

    return <>
        <nav className="navbar">
            <NavLink to='/' className="nav-brand">
                Cerberus
            </NavLink>
            <AuthGuard>
                <ul>
                    <li className="nav-item">
                        <NavLink to="" onClick={handleLogout}>
                            <i className="ico fa-solid fa-arrow-right-from-bracket"></i>
                            <i className="txt">Logout</i>
                        </NavLink>
                    </li>
                </ul>
            </AuthGuard>
        </nav>
    </>
}