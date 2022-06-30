/* 
 * 
 * Title  `Verify JWT`
 * Description: `this function takes existing jwt token and verifies them if they are vefied to access the api or not`
 * Author:MD.ALAMIN
 * Date:`30/6/2022`
 * 
*/


// dependencies
const jwt = require('jsonwebtoken')
require('dotenv').config()


// function body
const verifyJwt = (req, res, next) => {

    // if there's no authheader means unverified user 

    const authHeader = req.headers.authorization


    if (!authHeader) {
        res.status(403).send({ "Error": "Unauthorized" })
    }

    // if there is authHeader then it'll have its token so that we can verify it

    const token = authHeader.split(" ")[1]

    jwt.verify(token, process.env.JWT__SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ "Error": 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })


}


module.exports = verifyJwt