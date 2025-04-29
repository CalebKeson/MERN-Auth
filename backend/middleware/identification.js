const jwt = require("jsonwebtoken")

export const identifier = (req, res, next) => {
    let token;

    if (req.headers.client === "not browser") {
        token = req.headers.authorization
    } else {
        token = req.cookies["Authorization"]
    }

    if (!token) {
        res.status(403).json({ success: false, message: "You are not authorized to access this route!"})
    }

    try {
        const userToken = token.split(" ")[1]
        const jwtVerified = jwt.verify(userToken, process.env.JWT_SECRET)

        if (jwtVerified) {
            req.user = jwtVerified 
            next()
        } else {
            throw new Error("Invalid token")
        }
    } catch (error) {
        // handle errors  
        next(error)
    }
}

