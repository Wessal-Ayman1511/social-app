const generateMessages = (entity) => ({
    notFound: `${entity} Not Found`,
    alreadyExist: `${entity} Already Exist`,
    createdSuccessfully: `${entity} Created Successfully`,
    updatedSuccessfully: `${entity} Updated Successfully`,
    deletedSuccessfully: `${entity} Deleted Successfully`,
})

export const messages = {
    user: {...generateMessages('User'), incorrectPass: "user incorrect password"},
    otp: {...generateMessages('OTP')},
    post: {...generateMessages('Post')},
    comment: {...generateMessages('Comment')}
    
}