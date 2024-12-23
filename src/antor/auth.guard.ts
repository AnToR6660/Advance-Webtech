import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    
    const token = request.cookies['jwt']; // Fetch the token from the cookies
    if (!token) {
      throw new UnauthorizedException('Login Required!!!');
    }

    try {
      // Verify the token
      const decoded = await this.jwtService.verifyAsync(token);
      // Attach the decoded user info to the request object (if needed)
      request['user'] = decoded;
      return true; // Allow access if token is valid
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
