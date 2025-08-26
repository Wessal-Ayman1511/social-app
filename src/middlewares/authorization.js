export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.authUser.role)){
            return next (new Error("You aren't allowed!!!", {cause: 401}))
    }
    return next()
}}