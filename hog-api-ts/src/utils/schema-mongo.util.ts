import { Schema } from "mongoose";
import fs from "fs";
import path from "path";

export interface SchemasI {
	name: string;
	schema: Schema;
}

export async function getSchemasMongo(dir: string): Promise<SchemasI[]> {
	return Promise.all(
		fs.readdirSync(dir).map(async (file: string): Promise<SchemasI> => {
			const name: string = file
				.split(".")
				.at(0)
				?.replace("-", "_") as string;
			const schema: Schema = (await import(
				path.join(dir, file)
			)) as unknown as Schema;
			return { name, schema: Object.values(schema).at(0) };
		})
	);
}
