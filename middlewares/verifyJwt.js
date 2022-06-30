/* 
 * 
 * Title  `Verify JWT`
 * Description: `this function takes existing jwt token and verifies them if they are vefied to access the api or not`
 * Author:MD.ALAMIN
 * Date:`30/6/2022`
 * 
*/

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        res.status(403).send({ "Error": "Unauthorized" })
    }

    
}


module.exports = verifyJwt