import { RSA_PRIVATE_KEY, RSA_PUBLIC_KEY } from "@/config/jwt.config";
import { appError } from "@/constants/error.constant";
import { AppError } from "@/errors/app.error";
import { StatusCodes } from "http-status-codes";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export function generateAccessToken(payload: any, secret = RSA_PRIVATE_KEY) {
	const token = jwt.sign(payload, secret, {
		algorithm: "RS256",
		expiresIn: "15m",
	});

	const exp = new Date(new Date().getTime() + 15 * 60 * 1000);

	return { token, exp };
}

export function generateRefreshToken(payload: any, secret = RSA_PRIVATE_KEY) {
	return jwt.sign(payload, secret, {
		algorithm: "RS256",
		expiresIn: "60m",
	});
}

export function validateToken(token: string): {
	exp?: number;
	id: string;
	iat?: number;
} {
	try {
		return jwt.verify(token, RSA_PUBLIC_KEY, { algorithms: ["RS256"] }) as {
			id: string;
			exp?: number;
			iat?: number;
		};
	} catch (err) {
		let message: string = `bad token`;
		if (err instanceof JsonWebTokenError) {
			message = `invalid token`;
		} else if (err instanceof TokenExpiredError) {
			message = `token expired`;
		}
		throw new AppError({
			name: appError.AUTHORIZATION_FAILED,
			message,
			details: message,
			statusCode: StatusCodes.FORBIDDEN,
			origin: "validate token",
		});
	}
}
