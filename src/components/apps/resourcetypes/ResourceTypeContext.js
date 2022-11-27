import {createContext, useContext, useState} from "react";

const ResourceTypeContext = createContext(null)

function ResourceTypeProvider(props) {
    const [resourceType, setResourceType] = useState()

    const value = {
        resourceType: resourceType,
        setResourceType: setResourceType
    }

    return (
        <ResourceTypeContext.Provider value={value}>
            {props.children}
        </ResourceTypeContext.Provider>
    )
}

export {ResourceTypeContext, ResourceTypeProvider}