import {BrowserRouter, Routes, Route, useParams} from "react-router-dom";
// import './cerberus.css';
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Navmenu from "./components/menu/Navmenu";
import Main from "./components/main/Main";
import {AuthGuard} from "./context/AuthContext";
import {AppProvider} from "./components/apps/AppContext";
import Navbar from "./components/navbar/Navbar";
import {Container, Row, Col, ToastContainer, Toast} from 'react-bootstrap'
import VerifyEmail from "./components/verifyemail/VerifyEmail";
import {CerberusProvider} from "cerberus-reactjs";
import ForgotPassword from "./components/forgotpassword/ForgotPassword";
import ResetPassword from "./components/resetpassword/ResetPassword";
import {OAuthPopup} from "@a11n-io/react-use-oauth2";
import {NotificationContext} from "./context/NotificationContext";
import {useContext} from "react";

function Cerberus() {
    const notificationCtx = useContext(NotificationContext)

    return (
      <BrowserRouter basemname={`/${process.env.PUBLIC_URL}`}>
          <CerberusProvider apiHost={process.env.REACT_APP_CERBERUS_API_HOST} socketHost={process.env.REACT_APP_CERBERUS_WS_HOST}>
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
                                  <Route path="/callback" element={<OAuthPopup />} />
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

          </CerberusProvider>
      </BrowserRouter>
  );
}


export default Cerberus;
