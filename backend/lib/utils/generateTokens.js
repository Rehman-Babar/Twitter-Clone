import jwt from 'jsonwebtoken';

const jwttokenAndSetCookie = (userId, res) => {
const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: '15d'
})

res.cookie('jwt', token, {
    httpOnly:true,
    maxAge:15 * 24 * 60 * 60 * 1000,
    sameSite:'Strict',
    secure:process.env.NODE_ENV !== "develpment"
})

return token
}

export default jwttokenAndSetCookie;