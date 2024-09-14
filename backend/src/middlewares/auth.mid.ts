import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../utils/http-status";

export default (req: any, res: any, next: any) => {
  const token = req.headers.access_token;
  if (!token) return res.status(HTTP_UNAUTHORIZED).send();

  try {
    const decodedUser = verify(token, process.env.SECRET_JWT!);
    req.user = decodedUser;
  } catch {
    res.send(HTTP_UNAUTHORIZED).send();
  }

  return next();
};
