import { doubleCsrf } from "csrf-csrf";
import { CSRF_CONFIG } from "../config";

export const {
    doubleCsrfProtection,
    generateToken
} = doubleCsrf(CSRF_CONFIG);
