export class UserSession {
    constructor(public session: boolean){}
}

export const initialSessionState: UserSession = {
    session: false
}