import { UserRepository } from "@/repository/models/user.repository";
import { PostRepository } from "@/repository/models/post.repository";
import { MongoDBConnection } from "@/database/mongodb/connection.mongo";
import crypto from "crypto";
import { S3Service } from "@/services/s3";
import path from "path";

async function main() {
	const database = new MongoDBConnection();
	await database.init();
	const userRespository = new UserRepository(database);
	const postRepository = new PostRepository(database);

	for (let index of [...Array(120)].map((_, ind) => ind)) {
		const user = {
			email: `test${index + 1}@gmail.com`,
			username: `username${index + 1}`,
			password: "Password0",
		};
		await userRespository.createUser(user);
		const userCreated = await userRespository.getByEmail(user.email);
		const date: string = Date.now().toString();
		const id: string = userCreated!._id;
		const uuid: string = crypto.randomUUID();
		const key: string = `avatar/${id}/${uuid}_${date}.png`;
		await S3Service.uploadFile({
			key,
			filename: path.resolve(__dirname, `./avatar/${index}.png`),
		});
		await userRespository.updateInfo({
			id: userCreated!._id,
			urlImage: key,
			bio: "Metuentes igitur idem latrones Lycaoniam magna parte campestrem cum se inpares nostris fore congressione stataria documentis frequentibus scirent, tramitibus deviis petivere Pamphyliam diu quidem intactam sed timore populationum et caedium, milite per omnia diffuso propinqua, magnis undique praesidiis conmunitam.",
		});

		console.log(`user ${user.username} inserted`);
	}
}

main();
