const jsonWebToken = require('jsonwebtoken');
 
//Pourquoi c'est sous le format module.exports? et non exports.function?
const authorize = (req, res, next) => 
{
   try //Si une exception est levée par une des instructions alors catch.
   {
      //console.log(req.headers.authorization);
      //console.log(req.auth);
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jsonWebToken.verify(token, `${process.env.JWT_SECRET_KEY}`);
      const userId = decodedToken.userId;
      //console.log(userId);
      //console.log(req.auth);
      req.auth = { userId: userId};
      next();
   }
   catch(error) 
   {
      res.status(401).json({ error });
   }
};

module.exports = {authorize};

