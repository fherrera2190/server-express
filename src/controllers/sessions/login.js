const { generaJWT } = require("../../utils");
const userModel = require("../../dao/mongo/models/user.model");
const bcrypt = require("bcrypt");
const UserCurrent = require("../../dto/UserCurrent.dto");
module.exports = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.sendUserError("debe completar todos los campos");
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.status(401).redirect("/login");
  if (!bcrypt.compareSync(req.body.password.trim(), user.password))
    return res.status(401).redirect("/login");
  const userLimited = new UserCurrent(user);

  const token = generaJWT(userLimited);
  res.cookie("coderCookie", token, {
    maxAge: 1000 * 60 * 60,
    httpOnly: true
  });
  res.status(200).redirect("/");
};
