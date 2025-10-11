import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401); // no token

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, payload) => {
    if (err) return res.sendStatus(403); // bad token
    // payload = { userId, role, iat, exp }
    req.user = payload;
    next();
  });
}
