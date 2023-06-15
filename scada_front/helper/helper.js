export function getUser() {
    return localStorage.getItem('user')
}

export function getUserId() {
    return localStorage.getItem('user')['id']
}