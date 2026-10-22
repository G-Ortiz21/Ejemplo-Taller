import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { Carro } from '../types/carro';
import { useCarros, useAgregarCarro, useEliminarCarro, useEditarCarro } from '../hooks/useCarros';
import { useState } from 'react';

export default function App() {
  const [carroEditandoId, setCarroEditandoId] = useState<string | null>(null);

  // TanStack Query Hooks
  const { data: carros = [], isLoading, error } = useCarros();
  const { mutate: agregarCarro, isPending: isAdding, isError: isAddError } = useAgregarCarro();
  const { mutate: eliminarCarro, isPending: isDeleting } = useEliminarCarro();
  const { mutate: editarCarro, isPending: isEditing } = useEditarCarro();

  // Configuración de TanStack Form
  const form = useForm({
    defaultValues: {
      marca: '',
      modelo: '',
      tipo: '',
      color: '',
      motor: '',
    },
    onSubmit: async ({ value }) => {
      if (carroEditandoId) {
        editarCarro(
          { id: carroEditandoId, ...value },
          {
            onSuccess: () => {
              limpiarFormulario();
              Alert.alert('Éxito', 'Vehículo actualizado correctamente');
            },
            onError: () => Alert.alert('Error', 'No se pudo actualizar el vehículo'),
          }
        );
      } else {
        agregarCarro(value, {
          onSuccess: () => {
            limpiarFormulario();
            Alert.alert('Éxito', 'Vehículo publicado correctamente');
          },
          onError: () => Alert.alert('Error', 'No se pudo registrar el vehículo'),
        });
      }
    },
  });

  const limpiarFormulario = () => {
    form.reset();
    setCarroEditandoId(null);
  };

  const prepararEdicion = (carro: Carro) => {
    setCarroEditandoId(carro.id);
    form.setFieldValue('marca', carro.marca);
    form.setFieldValue('modelo', carro.modelo);
    form.setFieldValue('tipo', carro.tipo);
    form.setFieldValue('color', carro.color);
    form.setFieldValue('motor', carro.motor);
  };

  const confirmarEliminacion = (id: string) => {
    Alert.alert(
      'Eliminar Vehículo',
      '¿Estás seguro de que deseas retirar este vehículo del patio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => eliminarCarro(id, {
            onSuccess: () => Alert.alert('Éxito', 'Vehículo eliminado'),
            onError: () => Alert.alert('Error', 'No se pudo eliminar')
          })
        }
      ]
    );
  };

  if (isLoading) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#003366" />
      <Text style={styles.loadingText}>Cargando inventario de Patiotuerca...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>Error de conexión: {error.message}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Cabecera estilo Patiotuerca */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Patio<Text style={styles.navSubtitle}>tuerca</Text></Text>
        <Text style={styles.navTagline}>Gestión de Taller y Vitrina</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.sectionHeader}>
          {carroEditandoId ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}
        </Text>

        {/* Formulario */}
        <View style={styles.formCard}>
          
          {/* Campo Marca */}
          <form.Field
            name="marca"
            validators={{
              onChange: ({ value }) => (!value || value.trim() === '' ? 'La marca es obligatoria' : undefined),
            }}
            children={(field) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Marca</Text>
                <TextInput
                  placeholder="Ej. Chevrolet, Toyota..."
                  placeholderTextColor="#999"
                  value={field.state.value}
                  onChangeText={(text) => field.handleChange(text)}
                  onBlur={field.handleBlur}
                  style={styles.input}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <Text style={styles.errorTextField}>{field.state.meta.errors[0]}</Text>
                )}
              </View>
            )}
          />

          {/* Campo Modelo */}
          <form.Field
            name="modelo"
            validators={{
              onChange: ({ value }) => (!value || value.trim() === '' ? 'El modelo es obligatorio' : undefined),
            }}
            children={(field) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Modelo</Text>
                <TextInput
                  placeholder="Ej. Vitara, Hilux..."
                  placeholderTextColor="#999"
                  value={field.state.value}
                  onChangeText={(text) => field.handleChange(text)}
                  onBlur={field.handleBlur}
                  style={styles.input}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <Text style={styles.errorTextField}>{field.state.meta.errors[0]}</Text>
                )}
              </View>
            )}
          />

          {/* Campo Tipo */}
          <form.Field
            name="tipo"
            validators={{
              onChange: ({ value }) => (!value || value.trim() === '' ? 'El tipo de vehículo es obligatorio' : undefined),
            }}
            children={(field) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo</Text>
                <TextInput
                  placeholder="Ej. SUV, Sedán, Hatchback..."
                  placeholderTextColor="#999"
                  value={field.state.value}
                  onChangeText={(text) => field.handleChange(text)}
                  onBlur={field.handleBlur}
                  style={styles.input}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <Text style={styles.errorTextField}>{field.state.meta.errors[0]}</Text>
                )}
              </View>
            )}
          />

          {/* Campo Color */}
          <form.Field
            name="color"
            validators={{
              onChange: ({ value }) => (!value || value.trim() === '' ? 'El color es obligatorio' : undefined),
            }}
            children={(field) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Color</Text>
                <TextInput
                  placeholder="Ej. Blanco, Rojo, Gris..."
                  placeholderTextColor="#999"
                  value={field.state.value}
                  onChangeText={(text) => field.handleChange(text)}
                  onBlur={field.handleBlur}
                  style={styles.input}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <Text style={styles.errorTextField}>{field.state.meta.errors[0]}</Text>
                )}
              </View>
            )}
          />

          {/* Campo Motor */}
          <form.Field
            name="motor"
            validators={{
              onChange: ({ value }) => (!value || value.trim() === '' ? 'Las especificaciones del motor son obligatorias' : undefined),
            }}
            children={(field) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Motor</Text>
                <TextInput
                  placeholder="Ej. 1.6L, V6, Eléctrico..."
                  placeholderTextColor="#999"
                  value={field.state.value}
                  onChangeText={(text) => field.handleChange(text)}
                  onBlur={field.handleBlur}
                  style={styles.input}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <Text style={styles.errorTextField}>{field.state.meta.errors[0]}</Text>
                )}
              </View>
            )}
          />

          {/* Botón de envío principal */}
          <form.Subscribe
            selector={(state) => [state.canSubmit]}
            children={([canSubmit]) => {
              const isSubmittingNow = isAdding || isEditing;
              const isDisabled = !canSubmit || isSubmittingNow;

              return (
                <View style={{ marginTop: 12 }}>
                  {isSubmittingNow ? (
                    <ActivityIndicator size="small" color="#ff6600" />
                  ) : (
                    <TouchableOpacity
                      style={[styles.primaryButton, isDisabled && styles.disabledButton]}
                      onPress={() => form.handleSubmit()}
                      disabled={isDisabled}
                    >
                      <Text style={styles.primaryButtonText}>
                        {carroEditandoId ? "Actualizar Vehículo" : "Publicar Vehículo"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />

          {carroEditandoId && (
            <TouchableOpacity style={styles.cancelButton} onPress={limpiarFormulario}>
              <Text style={styles.cancelButtonText}>Cancelar Edición</Text>
            </TouchableOpacity>
          )}

          {isAddError && <Text style={styles.errorText}>Ocurrió un error al procesar la solicitud.</Text>}
        </View>

        <Text style={styles.sectionHeader}>Vehículos en Vitrina ({carros.length})</Text>

        {/* Lista de Carros Estilo Patiotuerca */}
        {carros.map((item) => (
          <View key={item.id?.toString()} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.marca} {item.modelo}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.tipo}</Text>
              </View>
            </View>
            
            <View style={styles.cardDetails}>
              <Text style={styles.detailText}>🎨 Color: <Text style={styles.bold}>{item.color}</Text></Text>
              <Text style={styles.detailText}>⚙️ Motor: <Text style={styles.bold}>{item.motor}</Text></Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => prepararEdicion(item)}>
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => confirmarEliminacion(item.id)}
              >
                <Text style={styles.deleteButtonText}>
                  {isDeleting ? "Retirando..." : "Eliminar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f8' },
  loadingText: { marginTop: 10, color: '#003366', fontWeight: '600' },
  
  // Navbar estilo Patiotuerca (Azul Marino y acento Naranja)
  navbar: { backgroundColor: '#002B49', paddingVertical: 20, paddingHorizontal: 20, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#FF6600' },
  navTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 0.5 },
  navSubtitle: { color: '#FF6600' },
  navTagline: { fontSize: 12, color: '#A0B2C6', marginTop: 2, textTransform: 'uppercase' },

  contentWrapper: { padding: 16 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#002B49', marginBottom: 12, marginTop: 10 },
  
  // Tarjeta de Formulario
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  inputGroup: { marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '600', color: '#333333', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#D0D7DE', padding: 10, borderRadius: 6, backgroundColor: '#FAFBFC', fontSize: 14, color: '#1F2328' },
  errorTextField: { color: '#D1242F', fontSize: 11, marginTop: 3 },
  errorText: { color: '#D1242F', textAlign: 'center', marginTop: 8, fontWeight: '600' },

  // Botones con estilo corporativo
  primaryButton: { backgroundColor: '#FF6600', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  disabledButton: { backgroundColor: '#FFC299' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#6E7781', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  cancelButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  // Tarjetas de la Lista de Carros
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E1E4E8', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#002B49' },
  badge: { backgroundColor: '#E1F0FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { color: '#0055CC', fontSize: 11, fontWeight: 'bold' },
  cardDetails: { marginBottom: 10, gap: 2 },
  detailText: { fontSize: 13, color: '#57606A' },
  bold: { fontWeight: '600', color: '#24292F' },
  
  // Acciones en Tarjetas
  actions: { flexDirection: 'row', gap: 10, marginTop: 6, borderTopWidth: 1, borderTopColor: '#F0F3F6', paddingTop: 10 },
  editButton: { flex: 1, backgroundColor: '#003366', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  editButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  deleteButton: { flex: 1, backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#FF8080', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  deleteButtonText: { color: '#D1242F', fontWeight: '600', fontSize: 13 }
});