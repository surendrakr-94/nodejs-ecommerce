const isValidMail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

const isValidName = (/^[a-zA-Z. ]{3,20}$/)

const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const isValidfild = (value) => {
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = (value) => {
    return Object.keys(value).length > 0
}

const isValidMobile = /^[6-9]{1}[0-9]{9}$/;

const isValidPassword = function (value) {
    if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(value)) return true;
    return false;
};

const isValidpin=function (value) {
    if (/^[1-9][0-9]{5}$/.test(value)) return true;
    return false;
};
//const isValidUrl=/^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|jfif))$/i

function validAddress(address){
    if(!address.street) return false
    if(!address.city) return false
    if(!address.pincode) return false
    return /^[a-zA-Z0-9 .\s\,\''\-]*$/.test(address.street.trim()) && /^[A-Za-z ]{1,20}$/.test(address.city.trim()) && 
    /^[1-9][0-9]{5}$/.test(address.pincode.trim())
}

function validImage(files){
    if(!files) return false
    let type = files.mimetype
    type = type.substr(0,type.indexOf('/'))
    if(type == 'image') return true
    return false
}

module.exports = {
    isValidMail, isValid, isValidName, isValidRequestBody, isValidfild, isValidMobile, isValidPassword,isValidpin,
    validImage,validAddress
}