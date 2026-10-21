//Importamos los hooks de tanstack query:
//-UseQuery para consultas get
//UseMutation para operaciones CRUD excepto GET
//useQueryClient: para interactuar con la cache

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { carrosService } from '../api/carros.service';

//Definir una constante key que servira como identificador unico
//para las queries relacionadas

const KEY = ['carros'];

export function useCarros() {
    return useQuery({
        queryKey: ['carros'],
        queryFn: () => {
            console.log('Get ejecutando con TanStack')
            return carrosService.getAll()
        },
        //StaleTime no sifnifica cuanot tiempo se gardan los datos en cache
        //sino cuanto tiempo los datos se consideran frescos
        staleTime: 1000 * 60 * 5 // cache valida por 5 minutos
    })
}

//Hook personalizado UseAgregar carro que encapsula la logica de agregar un carro nuevo 
//Usa useMutation que llama a carrosService.add()
//onSuccess: invalida la query 'carros' para refrescar la lista automnaticamente

export function useAgregarCarro() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (marca: string) => carrosService.add(marca),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY })
    })
}