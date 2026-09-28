import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ReservasService } from "./reservas/reservas.service";
import { CrearReservaDto } from "./dto/crear.reserva.dto";
import { ArticuloReservaDto } from "./dto/articulo.reserva.dto";
import { DisponibilidadInsuficienteError, FechasReservaInvalidasError } from "./dominio";


async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const servico = app.get(ReservasService);
    try {
        // PRIMER ESCENARIO: Camino feliz - nueva reserva
        const articulosUno: ArticuloReservaDto[] = [{
            articuloId: 1, // proyector láser...
            cantidad: 2 // existencias = 8
        }, {
            articuloId: 3, // bafle activo...
            cantidad: 9 // existencias = 16
        }, {
            articuloId: 2, // pantalla inflable gigante...
            cantidad: 1 // existencias = 4
        }];
        const dtoUno: CrearReservaDto = {
            clienteId: 1,
            fechaEntrega: new Date('2026-11-20'),
            fechaRecoleccion: new Date('2026-11-24'),
            calle: "Miguel Alemán",
            numero: "123",
            colonia: "Centro",
            articulos: articulosUno
        }
        console.log("");
        await servico.crear(dtoUno);
        console.log("Exito!");
        console.log(await servico.listar());
        console.log("");

        // SEGUNDO ESCENARIO: Primer error - fechas inválidas
        const articulosDos: ArticuloReservaDto[] = [{
            articuloId: 1,
            cantidad: 2
        }];
        const dtoDos: CrearReservaDto = {
            clienteId: 1,
            fechaEntrega: new Date('2026-10-5'),
            fechaRecoleccion: new Date('2026-10-4'), // ¿Un día antes de la entrega?
            calle: "Antonio Caso",
            numero: "456",
            colonia: "Villa Itson",
            articulos: articulosDos
        }
        try {
            await servico.crear(dtoDos);
        } catch (error) {
            if (error instanceof FechasReservaInvalidasError) {
                console.log("Exito!");
                console.error(error.message);
                console.log("");
            } else { throw error; }
        }

        // TERCER ESCENARIO: Segundo error - traslape de período
        const articulosTres: ArticuloReservaDto[] = [{
            articuloId: 1, // proyector láser...
            cantidad: 1 // existencias = 8 - 2 = 6 --> OK
        }, {
            articuloId: 3, // bafle activo...
            cantidad: 12 // existencias = 16 - 9 = 7 y 7 < 12 --> ERROR
        }, {
            articuloId: 2, // Ya no sigue con el resto...
            cantidad: 4
        }];
        const dtoTres: CrearReservaDto = {
            clienteId: 2,
            fechaEntrega: new Date('2026-11-20'),
            fechaRecoleccion: new Date('2026-11-25'),
            calle: "Benito Juárez",
            numero: "789",
            colonia: "Jecopaco",
            articulos: articulosTres
        }
        try {
            await servico.crear(dtoTres);
        } catch (error) {
            if (error instanceof DisponibilidadInsuficienteError) {
                console.log("Exito!");
                console.error(error.message);
                console.log("");
                console.log("Pruebas finalizadas! Los escenarios han sido exitosos!");
            } else { throw error; }
        }
    } catch (error) {
        console.log("FRACASO: Alguno de los escenarios arrojó un error inesperado!");
        if (error instanceof Error) console.error(error.message);
    } finally {
        app.close();
    }
}
bootstrap();