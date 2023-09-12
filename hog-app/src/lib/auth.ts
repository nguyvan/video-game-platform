import { typeToken } from "../types/token";

export class Auth {
    static get(type: typeToken = typeToken.ACCESS_TOKEN): string | null {
        return localStorage.getItem(type);
    }

    static set(type: typeToken = typeToken.ACCESS_TOKEN, token: string): void {
        localStorage.setItem(type, token);
    }

    static delete(type: typeToken = typeToken.ACCESS_TOKEN): void {
        localStorage.removeItem(type);
    }

    static removeAuthData(): void {
        Auth.delete(typeToken.ACCESS_TOKEN);
        Auth.delete(typeToken.EXP_ACCESS_TOKEN);
    }

    static getAuthData(): { token: string | null; exp?: string | null } {
        const token = Auth.get();
        const exp = Auth.get(typeToken.EXP_ACCESS_TOKEN);
        return { token, exp };
    }

    static isAuth(): boolean {
        return !!localStorage.getItem(typeToken.ACCESS_TOKEN);
    }
}
