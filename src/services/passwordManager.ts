import CryptoJS from "crypto-js"
import * as dotenv from "dotenv";
import UIDGenerator from "uid-generator";
dotenv.config();

const encryption_key = process.env.PASSWORD_ENCRYPTION_KEY!;
export const encryptPassWord = (password:string) => {
    const encryptedPassword = CryptoJS.AES.encrypt(password,encryption_key).toString();
    return encryptedPassword;
}

export const decryptedPassword = (encrypt:string) => {
    const decryptedText = CryptoJS.AES.decrypt(encrypt, encryption_key).toString(CryptoJS.enc.Utf8);
    return decryptedText;

}


export const generateToken = () => {
    let uuidToken = new UIDGenerator(512, UIDGenerator.BASE62);

    return uuidToken.generate();
}