import { PEPPER_TOKEN } from "@/config/password.config";
import bcrypt from "bcrypt";

export function generateSalt() {
	return bcrypt.genSaltSync();
}

export function generatePassword(password: string, salt: string) {
	// Salt token

	const saltPassword = bcrypt.hashSync(password, salt);

	return bcrypt.hashSync(saltPassword, PEPPER_TOKEN);
}

export function validatePassword(
	entry_password: string,
	hashed_password: string,
	salt: string
): boolean {
	return hashed_password === generatePassword(entry_password, salt);
}
