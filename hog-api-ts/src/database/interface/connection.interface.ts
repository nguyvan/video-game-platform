import { databaseName } from "../constant/name-database";
import { Model } from "mongoose";

export interface ConnectionI {
	get: <T>(dbname: string) => Model<T>;
	connect: (uri: string) => any;
	disconnect: () => void;
	getModalName: () => databaseName;
}
