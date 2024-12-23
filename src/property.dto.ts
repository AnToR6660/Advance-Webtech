import { IsEmail, IsNotEmpty } from "class-validator";
export class propertyDTO
{
    @IsNotEmpty({message:"name must be filled up"})
    name:string;

    @IsNotEmpty({message:"description must be filled up"})
    description: string;

    @IsNotEmpty({message:"location must be filled up"})
    location:string;

    @IsNotEmpty({message:"rent must be filled up"})
    rent:number;


}
