// save token to local storage
export function fnSaveTokenToLocalStorage(token) {
    console.log('Saving token to local storage:', token);
    localStorage.setItem('auth-token', token);
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
        // Verify the token was actually removed
        const token = window.localStorage.getItem('auth-token');
        if (!token) {
            console.log('Token successfully removed');
        }
    } catch (error) {
        console.error('Error removing token from localStorage:', error);
    }
}


export async function verifyAuth() {
    try {
        const options = {};
        
        // Add token from localStorage to Authorization header if it exists
        const localToken = fnGetTokenFromLocalStorage();
        if (localToken) {
            options.headers = {
                'Authorization': `Bearer ${localToken}`
            };
        }
        
        const response = await fetch('/api/auth/verify', options);
        return await response.json();
    } catch (error) {
        console.error('Error verifying authentication:', error);
        return {
            authenticated: false,
            message: 'Error verifying authentication'
        };
    }
}