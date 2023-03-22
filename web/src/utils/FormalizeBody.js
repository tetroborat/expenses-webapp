
export default function FormalizeBody(body) {
    Object.keys(body).forEach(function(key) {
        if (body[key] !== null) {
            body[key] = body[key].toString()
        }
    })
    return body
}
