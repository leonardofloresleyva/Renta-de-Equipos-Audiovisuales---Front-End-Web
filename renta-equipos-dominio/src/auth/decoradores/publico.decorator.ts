import { SetMetadata } from "@nestjs/common";

export const ES_PUBLICO = 'esPublico';

export const Publico = () => SetMetadata(ES_PUBLICO, true);