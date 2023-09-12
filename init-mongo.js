db.createUser({
	user: "hog",
	pwd: "Hog123",
	roles: [
		{
			role: "readWrite",
			db: "hog",
		},
	],
});
