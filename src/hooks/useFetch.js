import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {NotificationContext} from "../context/NotificationContext";

export default function useFetch(baseUrl) {
    const [loading, setLoading] = useState(false);
    const authCtx = useContext(AuthContext)
    const notificationCtx = useContext(NotificationContext)

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
            fetch(baseUrl + url, {
                method: "get",
                headers: hdrs
            })
                .then(response => response.json())
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

    function post(url, body, headers) {
        hdrs = { ...hdrs, ...headers }

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(baseUrl + url, {
                method: "post",
                headers: hdrs,
                body: JSON.stringify(body)
            })
                .then(response => response.json())
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
            fetch(baseUrl + url, {
                method: "put",
                headers: hdrs,
                body: JSON.stringify(body)
            })
                .then(response => response.json())
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
            fetch(baseUrl + url, {
                method: "delete",
                headers: hdrs
            })
                .then(response => response.json())
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
            fetch(baseUrl + url, {
                method: "post",
                headers: hdrs,
                body: form
            })
                .then(response => response.json())
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