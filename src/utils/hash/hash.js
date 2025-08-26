import bcrypt from 'bcrypt'

export const hash = ({data, saltRounds=8})=> {
    return bcrypt.hashSync(data, saltRounds)
}