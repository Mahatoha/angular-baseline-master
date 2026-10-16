export interface AuthenticatedUser {
    iat: string;
    email: string;
    name: string;
    familyName: string;
    givenName: string;
    sub: string;
    gender: string;
}
