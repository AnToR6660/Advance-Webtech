import { BadRequestException, Injectable, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { PropertyTbl, userTbl } from './antor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegistrationDTO } from 'src/user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response ,Request} from 'express';
import { propertyDTO } from 'src/property.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
@Injectable()
export class AntorService {
    constructor(@InjectRepository(userTbl)private userTbl: Repository<userTbl>,private jwtService:JwtService,
                @InjectRepository(PropertyTbl) private propertyTbl: Repository<PropertyTbl>,private mailerService: MailerService) {}
        
  
    async sendOtpEmail(email: string): Promise<string> 
    {
        const otp = crypto.randomInt(100000, 999999).toString()
        try {
            await this.mailerService.sendMail({
                to: email, // Recipient's email address
                subject: 'Email Verification OTP',
                text: `Your OTP is ${otp}`, // Plain text body
                html: `<p>Your OTP is <b>${otp}</b></p>`, // HTML body
                });
              return otp; 
            } catch (error) {
              throw new Error('Failed to send OTP');
            }
    }
    
    async verifyOtp(email: string, otp: string)
    {
        const user = await this.userTbl.findOne({ where: { email, otp } });
        if (!user) {
          throw new BadRequestException('Invalid OTP');
        }
    
        
        user.status = 'verified';
        await this.userTbl.save(user);
    return{
        message:'verification success'
    }
        
    }
        
        
        
    async registration(userRegistrationDTO:UserRegistrationDTO)
    {
        const existingUser = await this.userTbl.findOne({ where: { email: userRegistrationDTO.email } });
        if (existingUser) 
            {
                throw new BadRequestException('Email already exists!!!');
            }


        const saltOrRounds = 10
        userRegistrationDTO.password=await bcrypt.hash(userRegistrationDTO.password,saltOrRounds)

        const otp = await this.sendOtpEmail(userRegistrationDTO.email)
        const newUser = new userTbl()
        newUser.email = userRegistrationDTO.email
        newUser.password = userRegistrationDTO.password
        newUser.username = userRegistrationDTO.username
        newUser.phone = userRegistrationDTO.phone
        newUser.type=userRegistrationDTO.type
        newUser.status = 'pending'
        newUser.otp = otp
        
        



        return this.userTbl.save(newUser)
    }





    async login(loginDTO:LoginDTO,@Res({passthrough:true})response:Response)
    {
        const username=loginDTO.username
        const pass=loginDTO.password
        const user = await this.userTbl.findOne({ where: {  username} });
        if(!user)
            {
                throw new BadRequestException('Invalid Credential')
                
            }
        if(!await bcrypt.compare(pass,user.password))
            {
                throw new BadRequestException('Invalid Credential')
            }
        if(user.status!='verified')
            {
                throw new BadRequestException('Confirm your email')

            }
            const jwt=await this.jwtService.signAsync({id:user.id})
            
            response.cookie('jwt',jwt,{httpOnly:true})
            
            return {
                message:'success'
            }    
            
    
    }
    async findUser(request:Request)
    {
        try
        {
            const cookiee=request.cookies['jwt']
            const data=await this.jwtService.verifyAsync(cookiee)
            const id=data['id']
            
            if(!data)
                {
                    throw new UnauthorizedException();
                }
                const user= await this.userTbl.findOne({ where: {  id} })
            
            return user
        }catch
        {
            throw new UnauthorizedException();
        }
        
        
    }

    logoutUser(response:Response)
    {
        response.clearCookie('jwt')
        return {
            message:'successfully logged out'
        }
    }


    async addProperty(propertyDTO:propertyDTO,request)
    {
        const decodedUser = request['user'] 
        const userId = decodedUser.id
        
        const user = await this.userTbl.findOne({ where: { id: userId } })
        
        if (!user) {
            throw new UnauthorizedException('User not found')
        }

        if (user.type !== 'landlord') {
            throw new UnauthorizedException('Only landlords can add properties.')
        }
        const newProperty = new PropertyTbl()
        newProperty.name = propertyDTO.name
        newProperty.description = propertyDTO.description
        newProperty.location = propertyDTO.location
        newProperty.rent = propertyDTO.rent
        newProperty.sellerId = user.id
        newProperty.status='available'
        return await this.propertyTbl.save(newProperty)
    }


    async showAllProperty(request)
    {
        const decodedUser = request['user']
        const userId = decodedUser.id

        
        const user = await this.userTbl.findOne({ where: { id: userId } })
        
        if (!user) {
            throw new UnauthorizedException('User not found')
        }

        if (user.type !== 'landlord') {
            throw new UnauthorizedException('Unauthorized access!!!.')
        }

        const properties = await this.propertyTbl.find({where: { sellerId: user.id }})
        return properties;
        
    
    }


    async findPropertyById(propertyId: number, request)
    {
        const decodedUser = request['user']
        const userId = decodedUser.id
        const user = await this.userTbl.findOne({ where: { id: userId } })
        if (user.type !== 'landlord') {
            throw new UnauthorizedException('Unauthorized access!!!.')
        }
        const property = await this.propertyTbl.findOne({ where: { id: propertyId } })
        if (!property) {
            throw new UnauthorizedException('Property not found');
        }

        if (property.sellerId !== userId) {
            throw new UnauthorizedException('unauthorized property');
        }

        return property;

    }


    async editProperty(id, request)
    {
        const decodedUser = request['user']
        const userId = decodedUser.id
        const user = await this.userTbl.findOne({ where: { id: userId } })
        if (user.type !== 'landlord') {
            throw new UnauthorizedException('Unauthorized access!!!.')
        }

        const property = await this.propertyTbl.findOne({ where: { id: id } })
        if (!property) {
            throw new UnauthorizedException('Property not found');
        }

        if (property.sellerId !== userId) {
            throw new UnauthorizedException('unauthorized property');
        }

        if (property.sellerId == userId) {
            const { name, description, location, rent } = request.body
            property.name = name || property.name
            property.description = description || property.description
            property.location = location || property.location
            property.rent = rent || property.rent
            return await this.propertyTbl.save(property);

        }


    }


    async deleteProperty(id, request)
    {
        const decodedUser = request['user']
        const userId = decodedUser.id
        const user = await this.userTbl.findOne({ where: { id: userId } })
        if (user.type !== 'landlord') {
            throw new UnauthorizedException('Unauthorized access!!!.')
        }

        const property = await this.propertyTbl.findOne({ where: { id: id } })
        if (!property) {
            throw new UnauthorizedException('Property not found');
        }

        if (property.sellerId !== userId) {
            throw new UnauthorizedException('unauthorized property');
        }

        if (property.sellerId == userId) {
            
            this.propertyTbl.delete(property);
        
        }


    }



    async showTanentAllProperty(request)
    {
        const decodedUser = request['user']
        const userId = decodedUser.id
        const user = await this.userTbl.findOne({ where: { id: userId } })

        if (!user) {
            throw new UnauthorizedException('User not found')
        }

        if (user.type !== 'tanent') {
            throw new UnauthorizedException('Unauthorized access!!!.')
        }

        if (user.type == 'tanent') {
            const availableProperties = await this.propertyTbl.find({where: { status: 'available'}});
            return availableProperties;

        }
    }

    async buyProperty(id,request)
    {

        const decodedUser = request['user']
        const userId = decodedUser.id
        const user = await this.userTbl.findOne({ where: { id: userId } })
        if (!user) {
            throw new UnauthorizedException('User not found')
        }

        if (user.type !== 'tanent') {
            throw new UnauthorizedException('Unauthorized access!!!.')
        }

        if (user.type == 'tanent') {
            const property = await this.propertyTbl.findOne({where: { id: id, status: 'available'}});
            if (!property) {
                throw new NotFoundException('Property not available');
            }
            property.status='sold'
            property.user=user
            return await this.propertyTbl.save(property);
            

        }

    }
}
