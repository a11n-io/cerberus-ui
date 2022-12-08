import {BrowserRouter, Routes, Route, useSearchParams, Navigate, useNavigate} from "react-router-dom";
// import './cerberus.css';
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Navmenu from "./components/menu/Navmenu";
import Main from "./components/main/Main";
import {AuthContext, AuthGuard} from "./context/AuthContext";
import {AppProvider} from "./components/apps/AppContext";
import Navbar from "./components/navbar/Navbar";
import {Container, Row, Col, ToastContainer, Toast} from 'react-bootstrap'
import VerifyEmail from "./components/verifyemail/VerifyEmail";
import ForgotPassword from "./components/forgotpassword/ForgotPassword";
import ResetPassword from "./components/resetpassword/ResetPassword";
import {NotificationContext} from "./context/NotificationContext";
import {useContext, useEffect} from "react";
import useFetch from "./hooks/useFetch";
import {CerberusContext} from "cerberus-reactjs";

function Cerberus() {
    const notificationCtx = useContext(NotificationContext)
    // const authCtx = useContext(AuthContext)
    // const cerberusCtx = useContext(CerberusContext)

    // const {post} = useFetch("/")
    //
    // useEffect(() => {
    //     const interval = setInterval(() => refreshToken(), 1000 * 60);
    //     return () => clearInterval(interval);
    // }, [authCtx.user]);
    //
    // const refreshToken = () => {
    //
    //     if (authCtx.user && authCtx.user.refreshToken) {
    //
    //         post("auth/refreshtoken", {
    //             refreshToken: authCtx.user.refreshToken
    //         })
    //             .then(r => {
    //                 authCtx.login(r)
    //             })
    //             .catch(e => notificationCtx.error("refresh token", e.message))
    //     }
    // }

    return (
      <BrowserRouter basemname={`/${process.env.PUBLIC_URL}`}>
          <div id="pgside" className="m-2">
              <Navmenu/>
          </div>
          <main id="pgmain">
              <Container>
                  <Row>
                      <Col>
                          <Navbar/>
                      </Col>
                  </Row>
                  <Row>
                      <Col>
                          <AppProvider>
                              <Routes>
                                  <Route path="/*" element={<AuthGuard redirectTo="/login"><Main/></AuthGuard>}/>
                                  <Route exact path="/login" element={<Login/>}/>
                                  <Route exact path="/register" element={<Register/>}/>
                                  <Route exact path="/forgotpassword" element={<ForgotPassword/>}/>
                                  <Route exact path="/resetpassword/:hash" element={<ResetPassword/>}/>
                                  <Route exact path="/acceptinvitation/:hash" element={<Register/>}/>
                                  <Route exact path="/verifyemail/:hash" element={<VerifyEmail/>}/>
                                  <Route path="/callback" element={<OAuthCallback />} />
                              </Routes>
                              <ToastContainer position="top-end" className="p-3">
                              {
                                  notificationCtx.notifications.map((notification, idx) => {
                                      return (
                                          <Toast
                                              className="d-inline-block m-1"
                                              bg={notification.variant}
                                              key={idx}
                                              delay={5000}
                                              autohide
                                              onClose={() => {
                                                  notificationCtx.close(notification.id)
                                              }}
                                          >
                                              <Toast.Header>
                                                  <strong className="me-auto">{notification.header}</strong>
                                              </Toast.Header>
                                              <Toast.Body>
                                                  {notification.message}
                                              </Toast.Body>
                                          </Toast>
                                      )
                                  })
                              }
                              </ToastContainer>
                          </AppProvider>
                      </Col>
                  </Row>
              </Container>

          </main>
      </BrowserRouter>
  );
}

function OAuthCallback() {
    return <>
    Loading App...
    </>
}

export default Cerberus;
