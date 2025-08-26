import jwt from 'jsonwebtoken'

export const verifyToken = ({token , secretKey= process.env.JWT_KEY}) => {
    try {
        return jwt.verify(token, secretKey)   // return payload as object or throw an error
    } catch (error) {
        return {error}
        
    }

}