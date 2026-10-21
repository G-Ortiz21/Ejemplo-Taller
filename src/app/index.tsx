import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { Carro } from '../types/carro';
import {carrosService} from '../api/carros.service';
import {useCarros, useAgregarCarro } from '../hooks/useCarros'

//URL base de la API, tomada de variables de entorno de Expo
// const URL = `${process.env.EXPO_PUBLIC_API_URL}patio`

export default function App() {
  // Estado para almacenar la lista de carros obtenidos del backend mockeao
  // const [carros, setCarros] = useState < Carro [] > ([]) //setcarros funcion que utilñiza para actualizar el estado

  //Estado para manejar el texto ingresado en el Input
  const [marca, setMarca] = useState('')

  //Get de tanstack query para manejar la carga, el cache y los estados
  const {data:carros = [], isLoading, error} = useCarros()

  //Post: la mutacion invlaida la query carros y la lista se refresca
  const {mutate: agregarCarro} = useAgregarCarro();

  //POST: función para agregar un nuevo carro
  const cargar = async () => {
    agregarCarro(marca, { onSuccess: () => setMarca('')})
  }

  //Get: funcion reutilizable apra traer la lista desde el backend
  // const cargar = () => {
    //carrosService.getAll().then(setCarros)
    //console.log('GET ejecutado con axios desde pantalla index')
    // fetch(URL) //Llamada de la API
    //  .then(res => res.json()) //Parsear la respuesta a JSON
    //  .then(setCarros) //Guardar en el estado "carros"
    //console.log('GET ejecutado desde pantalla index') //Imprimirse en cada get realizado
  // }
  //El UseEffect se ejecuta una sola vez al montar el componente
 // useEffect(() => { cargar() }, [])

 //isLoading es true solo durante la prima carga, cuanod aun no hay datos
 //Mientras tanto mostramos un texto en lugar de la pantalla con la lista vacía
 if (isLoading) return <Text> Cargando...</Text>

 if (error) return <Text> Error: {error.message}</Text>


  //POST: funcion para agregar un nuevo carro
  const agregar = async () => {

    //await fetch(URL, {
    //  method: 'POST',
    //  headers: { 'Content-Type': 'application/json' },
      //Enviar la marca escrita
    //  body: JSON.stringify({ marca }),
    //})


    await carrosService.add(marca)
    console.log('POST ejecutado con axios desde pantalla index')
    cargar() //Get para refrescar la lista del home
    //Limpeamos el input
    setMarca('')
  }

  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: '#ffff' }}>
      <TextInput
        value={marca}
        onChangeText={setMarca}
        style={{ borderWidth: 3 }}
      />
      <Button title="Agregar" onPress={agregar} />
      <FlatList
        data={carros}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
          <Text>{item.id} - {item.marca}</Text>
        }
      />
    </View>
  )
}