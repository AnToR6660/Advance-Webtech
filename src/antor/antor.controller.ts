import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AntorService } from './antor.service';
import { publicEncrypt } from 'node:crypto';
import { UserRegistrationDTO } from 'src/user.dto';
import { LoginDTO } from 'src/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response ,Request} from 'express';
import { propertyDTO } from 'src/property.dto';
import { AuthGuard } from './auth.guard';


@Controller('antor')
export class AntorController {


    constructor(private readonly antorService: AntorService) {}
    @Post("/register")
    registration(@Body() userRegistrationDTO:UserRegistrationDTO)
    {
      return this.antorService.registration(userRegistrationDTO)
    }

    @Post('/verifyOtp')
    verifyOtp(@Body() body: any) 
    {
      const { email, otp } = body;
      return this.antorService.verifyOtp(email, otp);
    }



    @Post("/login")
    login(@Body() loginDTO:LoginDTO,@Res({passthrough:true})response:Response)
    {
      return this.antorService.login(loginDTO,response)
    }

    @Get("/findUser")
    findUser(@Req()request:Request)
    {

      return this.antorService.findUser(request)
      
    }

    @Post("/logout")
    logoutUser(@Res({passthrough:true})response:Response)
    {
      return this.antorService.logoutUser(response)
      
    }

    ///////////////////////////////////////////////////////////////////////property sell part/////////////////////////////////////////////////////////////
    @UseGuards(AuthGuard)
    @Post("/landlord/addProperty")
    addProperty(@Body()propertyDTO:propertyDTO,@Req() request: Request)
    {
      return this.antorService.addProperty(propertyDTO,request)
    }

    @UseGuards(AuthGuard)
    @Get("/landlord/allProperty")
    showAllProperty(@Req() request: Request)
    {
      return this.antorService.showAllProperty(request)
    }

    @UseGuards(AuthGuard) 
    @Get('/landlord/Property/:id')
    findPropertyById(@Param('id') id: number, @Req() request: Request) {
      return this.antorService.findPropertyById(id, request);
    }

    @UseGuards(AuthGuard) 
    @Patch("/landlord/Property/update/:id")
    editProperty(@Param('id') id ,@Req() request: Request)
    {
      return this.antorService.editProperty(id,request);

    }

    @UseGuards(AuthGuard) 
    @Delete("/landlord/Property/delete/:id")
    deleteProperty(@Param('id') id ,@Req() request: Request)
    {
      return this.antorService.deleteProperty(id,request);

    }


    ///////////////////////////////buy property////////////////////////////////////////
    @UseGuards(AuthGuard)
    @Get("/tanent/allProperty")
    showTanentAllProperty(@Req() request: Request)
    {
      return this.antorService.showTanentAllProperty(request)
    }

    @UseGuards(AuthGuard)
    @Post("/tanent/buyProperty/:id")
    buyProperty(@Param('id') id ,@Req() request: Request)
    {
      return this.antorService.buyProperty(id,request)
    }












    


    






    

   
    
}

