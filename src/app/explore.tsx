import { useEffect, useState } from "react";
import { View, Text, FlatList } from 'react-native';
import { Carro } from '../types/carro';
import { carrosService } from '../api/carros.service';
import { useCarros } from "@/hooks/useCarros";

// const URL = `${process.env.EXPO_PUBLIC_API_URL}patio`

export default function Explore() {
  // const [carros, setCarros] = useState<Carro[]>([])
  // useEffect(() => {
  //   console.log('GET ejcutado desde pantalla Explore con axios', URL);
  //   // fetch(URL)
  //   //  .then(res => res.json())
  //   //   .then(setCarros)
  //   carrosService.getAll().then(setCarros)
  // }, [])

  //Misma queryKey que index: comparten la cache con esa vista, asi que no se repite el get
  //Pero mientras los datos esten frescos

  const { data: carros = [] } = useCarros()

  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: '#ffff' }} >
      <FlatList
        data={carros}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <Text>{item.id} - {item.marca}</Text>
        }
      />
    </View>
  );
}