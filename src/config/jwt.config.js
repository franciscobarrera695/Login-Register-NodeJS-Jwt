import jwt from 'jsonwebtoken'

export const getToken = (payload) => {
    return jwt.sign({
        data:payload
    },'secret',{
        expiresIn:'1h'
    })
}

export const getTokenData = (token)=>{
    let data = null
    const decoded = jwt.verify(token,'secret')
    data = decoded
    return data
}