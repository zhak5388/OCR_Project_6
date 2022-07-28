const jsonWebToken = require("jsonwebtoken");
 
const authorize = (req, res, next) => 
{
   try //|| Si une exception est levée par une des instructions alors catch.
   {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jsonWebToken.verify(token, `${process.env.JWT_SECRET_KEY}`);
      const userId = decodedToken.userId;
      req.auth = { userId: userId};
      next();
   }
   catch(error) 
   {
      res.status(401).json({ error });
   }
};

module.exports = {authorize};

