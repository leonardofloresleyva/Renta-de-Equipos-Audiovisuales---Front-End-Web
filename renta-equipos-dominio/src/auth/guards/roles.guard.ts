import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decoradores/rol.decorator";
import { PayloadJwt } from "../dominio/payload.jwt";

@Injectable()
export class RolesGuard implements CanActivate {
    
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!roles || roles.length === 0) return true;
        
        const { user } = context.switchToHttp().getRequest<{ user: PayloadJwt}>();

        return roles.includes(user.rol);
    }
}