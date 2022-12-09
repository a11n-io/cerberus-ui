import React from 'react';
import { createRoot } from 'react-dom/client';
import './admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cerberus from './Cerberus';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {NotificationProvider} from "./context/NotificationContext";
import {CerberusProvider} from "@a11n-io/cerberus-reactjs";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(

    <NotificationProvider>
        <CerberusProvider apiHost={process.env.REACT_APP_CERBERUS_API_HOST} socketHost={process.env.REACT_APP_CERBERUS_WS_HOST}>
            <AuthProvider>
                <Cerberus />
            </AuthProvider>
        </CerberusProvider>
    </NotificationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
