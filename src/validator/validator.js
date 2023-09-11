function validBody(data){
    return Object.keys(data).length
}

function validName(name){
    if(typeof name !== 'string') return false
    return /^[a-zA-Z. ]{3,20}$/.test(name)
}

function validMail(email){
    if(typeof email !== 'string') return false
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)
}

function validPhone(phone){
    if(typeof phone !== 'string') return false
    return /^[6-9]{1}[0-9]{9}$/.test(phone)
}

function validPassword(password) {
    if(typeof password !== 'string') return false
    return /^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,15}$/.test(password)
}

function validAddress(address){
    return /^[a-zA-Z0-9\s\,\''\-]*$/.test(address['shipping'].street) && /^[A-Za-z ]{1,20}$/.test(address['shipping'].city) && 
    /^\d{6}$/.test(address['shipping'].pincode) && /^[a-zA-Z0-9\s\,\''\-]*$/.test(address['billing'].street) && /^[A-Za-z ]{1,20}$/.test(address['billing'].city) && 
    /^\d{6}$/.test(address['billing'].pincode)
}

module.exports = {validBody,validName,validMail,validPhone,validPassword,validAddress}