const jwt = require("jsonwebtoken")
const JWT_SECRET = "heyansh"

const fetchuser = (req,res,next) =>{
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).json({msg: "Please authenticate using validate user"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET)
        console.log(data)
        req.user = data.user
        next()
    } 
    catch (error) {
       return res.send(error)
    }
}
module.exports = fetchuser