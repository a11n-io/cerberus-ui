import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";

export default function useFetch(baseUrl) {
    const [loading, setLoading] = useState(false);
    const authCtx = useContext(AuthContext)

    const defaultHeaders = {
        "Content-Type": "application/json",
    }

    let hdrs = defaultHeaders
    if (authCtx.user) {
        hdrs = { ...hdrs, Authorization: 'Bearer ' + authCtx.user.token }
    }

    function get(url, headers) {
        hdrs = { ...hdrs, ...headers }

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(`${process.env.REACT_APP_CERBERUS_WEB_HOST}${baseUrl}${url}`, {
                credentials: "include",
                method: "get",
                headers: hdrs
            })
                .then(response => {
                    if (response.status === 401) {
                        authCtx.logout();
                    }
                    return response.json()
                })
                .then((data) => {
                    setLoading(false)
                    if (!data || !data.data) {
                        return reject(data)
                    }
                    resolve(data.data)
                })
                .catch(error => {
                    setLoading(false);
                    console.log(error)
                    reject(error);
                });
        });
    }

    function post(url, body, headers) {
        hdrs = { ...hdrs, ...headers }

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(`${process.env.REACT_APP_CERBERUS_WEB_HOST}${baseUrl}${url}`, {
                credentials: "include",
                method: "post",
                headers: hdrs,
                body: JSON.stringify(body)
            })
                .then(response => {
                    if (response.status === 401) {
                        authCtx.logout();
                    }
                    return response.json()
                })
                .then((data) => {
                    setLoading(false)
                    if (!data || !data.data) {
                        return reject(data)
                    }
                    resolve(data.data)
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    function put(url, body, headers) {
        hdrs = { ...hdrs, ...headers }

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(`${process.env.REACT_APP_CERBERUS_WEB_HOST}${baseUrl}${url}`, {
                credentials: "include",
                method: "put",
                headers: hdrs,
                body: JSON.stringify(body)
            })
                .then(response => {
                    if (response.status === 401) {
                        authCtx.logout();
                    }
                    return response.json()
                })
                .then((data) => {
                    setLoading(false)
                    if (!data || !data.data) {
                        return reject(data)
                    }
                    resolve(data.data)
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    function del(url, headers) {
        hdrs = { ...hdrs, ...headers }

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(`${process.env.REACT_APP_CERBERUS_WEB_HOST}${baseUrl}${url}`, {
                credentials: "include",
                method: "delete",
                headers: hdrs
            })
                .then(response => {
                    if (response.status === 401) {
                        authCtx.logout();
                    }
                    return response.json()
                })
                .then((data) => {
                    setLoading(false)
                    if (!data || !data.data) {
                        return reject(data)
                    }
                    resolve(data.data)
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    function postFiles(url, form) {

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(`${process.env.REACT_APP_CERBERUS_WEB_HOST}${baseUrl}${url}`, {
                credentials: "include",
                method: "post",
                headers: hdrs,
                body: form
            })
                .then(response => {
                    if (response.status === 401) {
                        authCtx.logout();
                    }
                    return response.json()
                })
                .then((data) => {
                    setLoading(false)
                    if (!data || !data.data) {
                        return reject(data)
                    }
                    resolve(data.data)
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    return { get, post, put, del, postFiles, loading };
};