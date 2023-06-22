export function getUser() {
    return JSON.parse(localStorage.getItem('user'))
}

export function getUserId() {
    return JSON.parse(localStorage.getItem('user'))['id']
}

export function getIsAdmin() {
    return JSON.parse(localStorage.getItem('user'))['isAdmin']
}