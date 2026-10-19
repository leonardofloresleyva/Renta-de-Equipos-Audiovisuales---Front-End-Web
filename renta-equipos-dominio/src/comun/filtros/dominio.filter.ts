import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { ErrorDeDominio, ErrorIntegridad, ErrorNoEncontrado, ErrorReglaDeNegocio } from "src/dominio/errores";
import { Response } from 'express';

@Catch(ErrorDeDominio)
export class DominioExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger('Dominio');

    private codigoPara(error: ErrorDeDominio): number {
        
        if (error instanceof ErrorNoEncontrado) return HttpStatus.NOT_FOUND;

        if (error instanceof ErrorIntegridad || error instanceof ErrorReglaDeNegocio) return HttpStatus.CONFLICT;

        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    catch(error: ErrorDeDominio, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<{ url: string; method: string }>();
        const estado = this.codigoPara(error);

        this.logger.warn(`${req.method} ${req.url} -> ${estado} ${error.constructor.name}`);

        // Todos los errores de dominio responden con la MISMA forma. Asi el
        // frontend los maneja en un solo lugar.
        res.status(estado).json({
            statusCode: estado,
            error: error.constructor.name,   // el nombre de la clase: "CupoLlenoError"
            message: error.message,          // el texto que se puso en el constructor
            path: req.url,
            timestamp: new Date().toISOString(),
        });
    }
}