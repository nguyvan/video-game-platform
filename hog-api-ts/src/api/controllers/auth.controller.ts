import { appError } from "@/constants/error.constant";
import { AppError } from "@/errors/app.error";
import { UserRepository } from "@/repository/models/user.repository";
import { Request, Response, NextFunction } from "@/types/express";
import { StatusCodes } from "http-status-codes";
import validator from "validator";
import { LoginI, SignupI } from "@/api/dto/auth.dto";
import { UserReturnI } from "@/repository/interfaces/user.interface";
import { validatePassword } from "@/utils/password.util";
import {
	generateAccessToken,
	generateRefreshToken,
	validateToken,
} from "@/utils/token.util";

export class AuthController {
	static async signup(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, email, password }: SignupI = req.body;
			const database = req.db!;
			if (!email || !validator.isEmail(email)) {
				return next(
					new AppError({
						name: appError.BAD_REQUEST,
						message: `email not invalid form`,
						details: `email not invalid form`,
						statusCode: StatusCodes.BAD_REQUEST,
						origin: "signup",
					})
				);
			}
			const userRepository = new UserRepository(database);
			const existedUsername: boolean =
				!!(await userRepository.getByUsername(username));
			const existedEmail: boolean = !!(await userRepository.getByEmail(
				email
			));
			if (existedEmail) {
				return next(
					new AppError({
						name: appError.CONFLICT,
						message: `email has been used`,
						details: `email has been used`,
						statusCode: StatusCodes.CONFLICT,
						origin: "signup",
					})
				);
			}
			if (existedUsername) {
				return next(
					new AppError({
						name: appError.CONFLICT,
						message: `username has been used`,
						details: `username has been used`,
						statusCode: StatusCodes.CONFLICT,
						origin: "signup",
					})
				);
			}

			await userRepository.createUser({
				email,
				username,
				password,
			});
			return res.status(StatusCodes.OK).json({});
		} catch (err) {
			next(err);
		}
	}

	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password }: LoginI = req.body;
			const database = req.db!;
			const userRepository = new UserRepository(database);
			const user =
				(await userRepository.getByUsername(username, true)) ||
				(await userRepository.getByEmail(username, true));
			if (!user) {
				return next(
					new AppError({
						name: appError.UNAUTHORIZED,
						message: `username ${username} is incorrect`,
						details: `username ${username} is incorrect`,
						statusCode: StatusCodes.UNAUTHORIZED,
						origin: "login",
					})
				);
			}

			const { password: hashedPassword, salt } = user as UserReturnI;

			const isMatchedPassword: boolean = validatePassword(
				password,
				hashedPassword as string,
				salt as string
			);

			if (!isMatchedPassword) {
				return next(
					new AppError({
						name: appError.UNAUTHORIZED,
						message: `password ${password.slice(
							0,
							3
						)}*** is incorrect`,
						details: `password ${password.slice(
							0,
							3
						)}*** is incorrect`,
						statusCode: StatusCodes.UNAUTHORIZED,
						origin: "login",
					})
				);
			}

			const payload = { id: user?._id };

			const { exp, token } = generateAccessToken(payload);
			const refreshToken = generateRefreshToken(payload);

			return res
				.cookie("refresh_token", refreshToken, {
					expires: new Date(Date.now() + 60 * 1000),
				})
				.status(StatusCodes.OK)
				.json({ exp, token });
		} catch (err) {
			next(err);
		}
	}

	static async logout(req: Request, res: Response, next: NextFunction) {
		try {
			res.clearCookie("refresh_token");
			return res.status(StatusCodes.OK).json({});
		} catch (err) {
			next(err);
		}
	}

	static async refreshToken(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const refreshToken = req.cookies.refresh_token;
			if (!refreshToken) {
				throw new AppError({
					name: appError.AUTHORIZATION_FAILED,
					message: `not found refresh_token`,
					details: `not found refresh_token`,
					statusCode: StatusCodes.FORBIDDEN,
					origin: "refreshToken",
				});
			}
			const payload = validateToken(refreshToken);
			delete payload?.exp;
			delete payload?.iat;
			if (!payload.id) {
				throw new AppError({
					name: appError.AUTHORIZATION_FAILED,
					message: `invalid payload (empty id)`,
					details: `invalid payload (empty id)`,
					statusCode: StatusCodes.FORBIDDEN,
					origin: this.refreshToken.name,
				});
			}
			const userRepository = new UserRepository(database);
			const user: boolean = !!(await userRepository.getById(payload.id));
			if (!user) {
				throw new AppError({
					name: appError.AUTHORIZATION_FAILED,
					message: `invalid payload id (user not found)`,
					details: `invalid payload id (user not found)`,
					statusCode: StatusCodes.FORBIDDEN,
					origin: this.refreshToken.name,
				});
			}

			const { token, exp } = generateAccessToken(payload);

			const newRefreshToken = generateRefreshToken(payload);

			return res
				.cookie("refresh_token", newRefreshToken, {
					expires: new Date(Date.now() + 60 * 1000),
				})
				.status(StatusCodes.OK)
				.json({ token, exp });
		} catch (err) {
			next(err);
		}
	}
}
