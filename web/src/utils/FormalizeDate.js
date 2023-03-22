
export default function FormalizeDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date)
    }
    return `${
        date.getFullYear()
    }-${
        ('0' + (1 + date.getMonth())).slice(-2)
    }-${
        ('0' + date.getDate()).slice(-2)
    }`
}