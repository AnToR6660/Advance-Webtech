import { IsEmail, IsNotEmpty } from "class-validator";
export class LoginDTO
{
    @IsNotEmpty({message:"username must be filled up"})
    username:string;
    @IsNotEmpty({message:"password must be filled up"})
    password: string;

  

   
}