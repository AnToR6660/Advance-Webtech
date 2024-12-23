import { IsEmail, IsNotEmpty } from "class-validator";
export class UserRegistrationDTO
{
    @IsNotEmpty({message:"email must be filled up"})
    @IsEmail()
    email:string;

    @IsNotEmpty({message:"password must be filled up"})
    password: string;

    @IsNotEmpty({message:"username must be filled up"})
    username:string;

    @IsNotEmpty({message:"phone must be filled up"})
    phone:string;

    @IsNotEmpty({message:"type must be filled up"})
    type:string;



}