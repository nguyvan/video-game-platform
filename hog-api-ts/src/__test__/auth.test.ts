import { configurationApp } from "@/api";
import { MongoDBConnection } from "@/database/mongodb/connection.mongo";
import { UserI } from "@/database/mongodb/dto/user.dto";
import { StatusCodes } from "http-status-codes";
import supertest from "supertest";

const app = configurationApp();
const requestWithSuperTest = supertest(app);

describe("auth", () => {
	it("signup", async () => {
		const userTest = {
			username: "test1",
			email: "test1@gmail.me",
			password: "Password0",
		};

		const { body, status } = await requestWithSuperTest
			.post("/api/auth/signup")
			.send(userTest);

		expect(status).toEqual(StatusCodes.OK);

		const db = new MongoDBConnection();
		await db.init();
		const userModel = db.get<UserI>("user");
		await userModel.deleteOne({
			username: "test1",
		});
	});

	it("login", async () => {
		const userTest = {
			username: "username1",
			password: "Password0",
		};

		const { body, status } = await requestWithSuperTest
			.post("/api/auth/login")
			.send(userTest);

		expect(status).toEqual(StatusCodes.OK);
		expect(body).toHaveProperty("exp");
		expect(body).toHaveProperty("token");
	});
});
