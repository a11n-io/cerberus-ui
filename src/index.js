import React from 'react';
import { createRoot } from 'react-dom/client';
import './admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cerberus from './Cerberus';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {NotificationProvider} from "./context/NotificationContext";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
      <AuthProvider>
          <NotificationProvider>
            <Cerberus />
          </NotificationProvider>
      </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
