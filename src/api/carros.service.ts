//Import el cliente axios y el tipo carro
import {client} from './client';
import {Carro} from '../types/carro';

//Definir un servicio lllamado carrosService
//El servicio centraliza las operaciones de la entidad Carro
//Retorna ua rpomesa con un arreglo de objeto
//Poner metodos asincronicos para interactuar con la API

export const carrosService = {
    getAll: async (): Promise<Carro[]> => {
        const {data} = await client.get<Carro[]>('patio')
        return(data)
    },

    add: async (marca:string) : Promise<Carro> => {
        const {data} = await client.post<Carro>('patio', {marca})
        return data
    }
}

