import CryptoJS from "crypto-js";

export const encypt = ({data, key= process.env.CRYPTO_KEY}) => {
    return CryptoJS.AES.encrypt(data, key).toString()
}