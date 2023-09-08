export function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return;
    }
}

export function getUserId() {
    try {
        return JSON.parse(localStorage.getItem('user'))['id']
    } catch {
        return;
    }
}

export function getIsAdmin() {
    try {
        return JSON.parse(localStorage.getItem('user'))['isAdmin']
    } catch {
        return;
    }
}