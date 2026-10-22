//Importamos los hooks de tanstack query:
//-UseQuery para consultas get
//UseMutation para operaciones CRUD excepto GET
//useQueryClient: para interactuar con la cache

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { carrosService } from '../api/carros.service';
import { Carro } from '../types/carro'

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
        mutationFn: (nuevoCarro: Omit<Carro, 'id'>) => carrosService.add(nuevoCarro),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY })
    })
}

// Hook para eliminar carro
export function useEliminarCarro() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => carrosService.delete(id),
        
        // 1. Se ejecuta antes de que la mutación comience
        onMutate: async (idCarroEliminar) => {
            // Cancelar cualquier refetch en curso para que no sobrescriban nuestra actualización optimista
            await qc.cancelQueries({ queryKey: KEY });

            // Guardar el valor anterior de la caché (snapshot) por si necesitamos hacer rollback
            const carrosAnteriores = qc.getQueryData<Carro[]>(KEY);

            // Actualizar la caché de forma optimista eliminando el carro inmediatamente
            qc.setQueryData<Carro[]>(KEY, (oldCarros = []) => 
                oldCarros.filter((carro) => carro.id !== idCarroEliminar)
            );

            // Retornar el contexto con los datos anteriores para usarlos en caso de error
            return { carrosAnteriores };
        },

        // 2. Si la petición falla, revertimos los cambios usando el contexto anterior
        onError: (err, idCarroEliminar, context) => {
            if (context?.carrosAnteriores) {
                qc.setQueryData(KEY, context.carrosAnteriores);
            }
        },

        // 3. Al terminar (sea éxito o error), invalidamos para sincronizar con el servidor
        onSettled: () => {
            qc.invalidateQueries({ queryKey: KEY });
        },
    });
}

// Hook para editar carro
export function useEditarCarro() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (carro: Carro) => carrosService.update(carro.id, carro),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    });
}