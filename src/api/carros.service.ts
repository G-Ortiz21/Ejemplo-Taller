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

    add: async (nuevoCarro: Omit<Carro, 'id'>) : Promise<Carro> => {
        const {data} = await client.post<Carro>('patio', nuevoCarro)
        return data
    },

    // Método para eliminar
    delete: async (id: string | number): Promise<void> => {
        await client.delete(`patio/${id}`);
    },

    // Método para editar
    update: async (id: string | number, carro: Omit<Carro, 'id'>): Promise<Carro> => {
        const { data } = await client.put<Carro>(`patio/${id}`, carro);
        return data;
    }
}

