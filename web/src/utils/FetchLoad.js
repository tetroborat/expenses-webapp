import {DOMAIN_API} from "../index";

export default function FetchLoad({path, body, path_group = '/api', method= 'GET'}) {
    let response
    path = `${DOMAIN_API}${path_group}${path}`
    if (body && method === 'POST') {
        response = fetch(path, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body)
        })
    }
    else {
        response = fetch(path, {
            // headers: {
            //     'Authorization': bearer,
            // },
            method: method,
            credentials: 'include',
        })
    }
    return response.then(response => response.json()).then(data => data);
}