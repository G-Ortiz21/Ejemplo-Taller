//Tab desde expo-router, define la navegación de tipo stack
//Importamos QueryCliente y QueryClientprovider desde tanstack
//Estos se usan para configurar y proveer el cliente de queries en toda la app
import { Tabs } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//Creamos un a instancia de QueryClient
//Este objeto administra la cache y el ciclo de vida de las querys/mutations

const qc = new QueryClient()

//componente layout, para envolver la navegacion dentro del QueriClientProvider
//Con esto, todos los componentes hijos pueden usar Query y useMutation
//Este es el punto de integracion entra TanStack Query y la navegación  de Expo

export default function Layout() {
  return (
    <QueryClientProvider client={qc}>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      </Tabs>

    </QueryClientProvider>
  )
}