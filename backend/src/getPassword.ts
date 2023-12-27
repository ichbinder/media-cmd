import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adminPw: string | undefined = process.env.ADMIN_PW;

if (!adminPw) {
    throw new Error('Please define the environment variable ADMIN_PW.');
}

const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

hashPassword(adminPw).then((result) => console.log(result));

