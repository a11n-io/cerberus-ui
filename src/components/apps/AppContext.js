import {createContext, useContext, useState} from "react";

const AppContext = createContext(null)

function AppProvider(props) {
    const [app, setApp] = useState()

    const value = {
        app: app,
        setApp: setApp
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export {AppContext, AppProvider}