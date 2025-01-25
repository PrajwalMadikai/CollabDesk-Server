import bcrypt from 'bcrypt'

export class BcryptService{
    async hashPassword(password:string):Promise<string>{

        return bcrypt.hash(password,10)
    }
    
    async comparePassword(password:string,hashedPass:string):Promise<boolean>
    {
        return bcrypt.compare(password,hashedPass)
    }
}