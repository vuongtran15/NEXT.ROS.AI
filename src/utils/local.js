

export const LocalStorageKeys = {
    SERVER_CHAT_URL: 'https://172.19.137.206:8080',
    //SERVER_API_URL: 'http://172.19.18.35:8201',
    SERVER_API_URL: 'https://172.19.137.206:5204',
    
};



// save token to local storage
export function fnSaveTokenToLocalStorage(token, userInfo) {
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user', JSON.stringify(userInfo));
}
// get token from local storage
export function fnGetTokenFromLocalStorage() {
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


