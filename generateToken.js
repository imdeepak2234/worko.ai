const jwt = require("jsonwebtoken");

const payload = {
  id: "some-user-id",
  email: "user@example.com",
};

const token = jwt.sign(payload, "your_jwt_private_key", { expiresIn: "1h" });
console.log(token);
