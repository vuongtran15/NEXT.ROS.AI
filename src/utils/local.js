
// save token to local storage
export function fnSaveTokenToLocalStorage(token, userInfo) {
    console.log('Saving token to local storage:', token);
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user', JSON.stringify(userInfo));
}
// get token from local storage
export function fnGetTokenFromLocalStorage() {
    console.log('Getting token from local storage');
    return localStorage.getItem('auth-token');
}
export function fnRemoveTokenFromLocalStorage() {
    try {
        console.log('Removing token from local storage');
        window.localStorage.removeItem('auth-token');
        window.localStorage.removeItem('auth-user');
        // Verify the token was actually removed
        const token = window.localStorage.getItem('auth-token');
        if (!token) {
            console.log('Token successfully removed');
        }
    } catch (error) {
        console.error('Error removing token from localStorage:', error);
    }
}

export function fnGetUserFromLocalStorage() {
    try {
        console.log('Getting user from local storage');
        const user = window.localStorage.getItem('auth-user');
        if (user) {
            return JSON.parse(user);
        } else {
            console.log('No user found in local storage');
            return null;
        }
    } catch (error) {
        console.error('Error getting user from localStorage:', error);
        return null;
    }

}

