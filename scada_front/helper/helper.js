export function getUser() {
    return JSON.parse(localStorage.getItem('user'))
}

export function getUserId() {
    return JSON.parse(localStorage.getItem('user'))['id']
}