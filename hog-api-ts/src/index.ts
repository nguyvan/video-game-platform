import http from "node:http";
import "reflect-metadata";
import { configurationApp } from "@/api";
import { container } from "@/config/inversify.config";
import { INJECTION_TYPE } from "@/constants/injection.constant";
import { SocketServiceI } from "@/services/socket/socket.interface";
import { SocketService } from "@/services/socket/socket.service";

const PORT: number = 5000;

const start = async () => {
	const server = http.createServer(configurationApp());
	container.bind<http.Server>(INJECTION_TYPE.SERVER).toConstantValue(server);
	container
		.bind<SocketServiceI>(INJECTION_TYPE.SOCKET_SERVICE)
		.to(SocketService)
		.inSingletonScope();
	const socketService = container.get<SocketService>(
		INJECTION_TYPE.SOCKET_SERVICE
	);
	await socketService.init();
	server
		.listen(PORT, () => {
			console.log(`Server listening on ${PORT}`);
		})
		.on("error", (error) => {
			console.log(error);
			process.exit();
		});
};

start();
