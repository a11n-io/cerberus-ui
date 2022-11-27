import {createContext, useState} from "react";

const NotificationContext = createContext(null)

function NotificationProvider(props) {
    const [notifications, setNotifications] = useState([])

    const info = (header, message) => {
        if (message) {
            setNotifications(prev => [...prev, {id: Date.now(), variant: "info", header: header, message: message}])
        }
    }

    const warning = (header, message) => {
        if (message) {
            setNotifications(prev => [...prev, {id: Date.now(), variant: "warning", header: header, message: message}])
        }
    }

    const error = (header, message) => {
        if (message) {
            console.error(header, message)
            setNotifications(prev => [...prev, {id: Date.now(), variant: "danger", header: header, message: message}])
        }
    }

    const close = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const value = {
        notifications: notifications,
        info: info,
        warning:warning,
        error: error,
        close: close
    }

    return (
        <NotificationContext.Provider value={value}>
            {props.children}
        </NotificationContext.Provider>
    )

}

export {NotificationContext, NotificationProvider}