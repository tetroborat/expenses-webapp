
export default function deleteCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=;max-age=-1`
}
