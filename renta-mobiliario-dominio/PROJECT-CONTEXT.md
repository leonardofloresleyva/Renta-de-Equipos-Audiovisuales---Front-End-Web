Documentación
Objetivo
El propósito de este sistema es resolver el problema de control y gestión de la renta de equipo y mobiliario, dejando atrás el registro manual que ralentiza la consulta y la disponibilidad al tener que revisar hoja por hoja. De igual forma, el sistema elimina el riesgo de rentar el mismo equipo a dos clientes distintos en el mismo período, lo que conlleva un problema costoso y la pérdida de clientes.

El sistema está dirigido a dos perfiles principales: clientes y administradores. Para los clientes, aporta el valor de consultar por sí mismos qué artículos están disponibles en los rangos de fechas que necesitan, así como de crear y confirmar su propia reserva y monitorear su estado. Para los administradores, ofrece una herramienta centralizada para llevar el control de lo que sale, de lo que regresa y de la condición en la que regresa.

El valor central del proyecto radica en gestionar la disponibilidad de los equipos en un rango de fechas, garantizando que el sistema indique cuántas piezas quedan libres y no permita que dos reservas se traslapen en el mismo artículo.

Justificación
La elección de este proyecto se debe al interés de nuestro equipo por analizar la necesidad que enfrenta un negocio de alquiler de eventos, en particular cuando una gestión organizada resulta clave para evitar la pérdida de clientes.

Otro punto importante para nuestra elección viene por la parte del desarrollo, ya que, a diferencia de tiendas en línea convencionales, al tratarse en este caso de un sistema de renta de mobiliario y eventos, aquí en vez de que el stock disminuya, los artículos simplemente se apartan y liberan dentro de intervalos de fechas definidos.
Por último, como equipo vimos una gran oportunidad con este proyecto para poder aplicar principios de arquitectura así como de diseño guiado por dominio como los ejemplos vistos en clase pero a una mayor escala, lo cual supone un reto bastante interesante para nosotros.


Temática del dominio
Giro elegido: Renta de equipo audiovisual para eventos y fiestas.

Se ha elegido la renta de equipo audiovisual porque se alinea perfectamente con el reto central del sistema, ya que se trata de artículos que se utilizan en rangos de fechas específicos y requieren un estricto control para evitar empalmes. Además, por la naturaleza de estos equipos electrónicos, es indispensable contar con el registro de depósitos en garantía, la anotación de piezas que regresan dañadas o no devueltas, y la posibilidad de bloquear piezas para retirarlas e inhabilitarlas temporalmente por motivos de mantenimiento o reparación.
 
Glosario del dominio
“Enlista los términos propios del negocio y qué significa cada uno. Es el vocabulario que se va a usar en el código, en las pantallas y en las reuniones, y ponerse de acuerdo hoy evita discusiones inútiles después.”


Reglas de negocio
Las siguientes reglas de negocio representan ciertos impedimentos dentro de la lógica de negocio:

Regla de negocio 01 - Prohibición de reservación por traslape de fechas: No se puede confirmar una reserva si en algún día del rango solicitado no hay piezas disponibles de alguno de los artículos seleccionados; esto no se puede hacer porque no es posible comprometer las piezas de un mismo artículo que han sido reservadas por otro cliente o por mantenimiento.
Regla de negocio 02 - Prohibición de reservas con fechas inválidas o pasadas: No se puede generar una reserva si la fecha de recolección es igual o anterior a la de entrega, o si la entrega se solicita en una fecha ya transcurrida; esto no puede llevarse a cabo ya que un negocio que ofrece servicios de renta siempre debe ofrecer un período con una duración mínima de un día.
Regla de negocio 03 - Prohibición de confirmar una reserva sin depósito en garantía: No se puede confirmar una reserva sin haber cubierto el depósito en garantía estimado; no se puede hacer porque la empresa requiere un respaldo económico ante posibles pérdidas o averías de los equipos.
Regla de negocio 04 - Prohibición de reincorporación de piezas dañadas: No se puede reintegrar al inventario para renta ninguna pieza que haya sido devuelta dañada o con una avería; esto no se permite porque el equipo requiere un proceso de mantenimiento o reparación antes de volver a entrar al inventario.
Regla de negocio 05 - Prohibición de decremento de existencias ya reservadas: No se pueden reducir las existencias de un artículo por debajo de la cantidad de piezas ya reservadas o bloqueadas por mantenimiento; no se puede hacer porque las piezas reservadas o en mantenimiento siguen existiendo fuera de sus respectivos períodos (otro cliente puede reservar esas mismas piezas cuando estén nuevamente disponibles en un período).
Regla de negocio 06 - Prohibición de cancelar reservas entregadas: No se puede cancelar una reserva cuyos artículos ya hayan sido entregados; es decir, las reservas pueden cancelarse únicamente antes de su fecha de entrega. Esto no se puede hacer porque liberaría las piezas disponibles para otras reservas cuando ya están ocupadas, lo que ocasionaría problemas como el mencionado al final del segundo párrafo de la descripción del proyecto.

Las siguientes reglas de negocio representan las funciones y el flujo básico con los que el sistema debe contar y permitir:
Regla de negocio 07 - Cálculo de disponibilidad: El sistema debe permitir el cálculo dinámico para obtener y mostrar la disponibilidad de un artículo en el período seleccionado.
Regla de negocio 06 - Exclusión de disponibilidad por mantenimiento: Como el sistema no debe permitir ingresar equipo con reporte de daño o avería, se espera que todo equipo marcado con algún reporte de daño o avería quede automáticamente excluido  del inventario de renta durante el periodo de tiempo que dure su reparación.
Regla de negocio 07 - Descuento de garantía por daños o piezas faltantes: Al momento de registrar la recolección del equipo, si se llega a detectar que hay piezas averiadas o faltantes, el costo de reparación o reposición se descuenta del depósito en garantía antes de realizar la devolución de dinero.
Regla de negocio 08 - Validación de mantenimiento: El sistema no permite dejar menos piezas de las que ya están apartadas en reservas futuras.


Decisiones de diseño
Elección del almacenamiento
La base de datos que elegimos para el proyecto es MySQL. Las relaciones de nuestro sistema son muy estrictas y una base de datos como MySQL está diseñada para proteger la integridad de los datos que necesitamos.
La información de dominio es fija; al centrar el giro de negocio en equipos audiovisuales, ya tenemos una estructura de datos predecible que no requiere una base de datos no relacional para consultas complejas y forzamos a que los datos siempre cuenten con el formato correcto.

Arquitectura del sistema
“Elige cómo se va a organizar el sistema completo y justifícalo. Debe quedar claro qué parte atiende al público, qué parte administra y qué parte concentra las reglas del negocio, y por qué esa separación conviene a este proyecto en particular.”

Contrato entre las partes
“Describe, sin entrar en detalle, qué información le va a pedir cada parte del sistema a la otra y qué le va a devolver. Este acuerdo es el que permite que el trabajo de los siguientes avance en paralelo.”


