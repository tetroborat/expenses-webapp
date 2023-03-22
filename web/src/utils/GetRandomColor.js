let letters = '0123456789ABCDEF'

export default function GetRandomColor() {
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
