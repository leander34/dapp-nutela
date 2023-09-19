type Credentials = { user: any, secret: string }
export function doSignUpBackend(credentials: Credentials): Promise<{ token: string }>{
    return new Promise((resolve, reject) => {
        return resolve({ token: 'token' });
    })
}
 
export function doSignInBackend(credentials: Credentials): Promise<{ token: string }> {
    return new Promise((resolve, reject) => {
        if (credentials.user === 'a'
        && credentials.secret === 'a' )
            return resolve({ token: 'token' });
        return reject(`401 Unauthorized`);
    })
}
 
export function doSignOutBackend(token: string) {
    return new Promise((resolve, reject) => {
        if (token === 'token')
            return resolve({ token: null });
        return reject(`401 Unauthorized`);
    })
}
 
export function getProfileBackend(token: string): Promise<{name: string}> {
    return new Promise((resolve, reject) => {
        if (token === 'token')
            return resolve({ name: 'leander' });
        return reject(`401 Unauthorized`);
    })
}