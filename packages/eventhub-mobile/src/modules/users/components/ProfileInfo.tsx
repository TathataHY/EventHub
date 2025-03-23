import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, UpdateProfileParams } from '../types/user.types';
import { colors } from '@theme/base/colors';
import { getColorValue } from '@theme/index';

interface ProfileInfoProps {
  user: User;
  isEditable?: boolean;
  onSave?: (profileData: UpdateProfileParams) => Promise<{ success: boolean, error?: string }>;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  user,
  isEditable = false,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [city, setCity] = useState(user.location?.city || '');
  const [state, setState] = useState(user.location?.state || '');
  const [country, setCountry] = useState(user.location?.country || '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Manejar inicio de edición
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Manejar cancelación de edición
  const handleCancel = () => {
    setIsEditing(false);
    setFullName(user.fullName);
    setUsername(user.username);
    setBio(user.bio || '');
    setPhoneNumber(user.phoneNumber || '');
    setCity(user.location?.city || '');
    setState(user.location?.state || '');
    setCountry(user.location?.country || '');
    setError(null);
  };

  // Manejar guardado de cambios
  const handleSave = async () => {
    if (!onSave) return;
    
    setSaving(true);
    setError(null);
    
    const profileData: UpdateProfileParams = {
      fullName,
      username,
      bio: bio || undefined,
      phoneNumber: phoneNumber || undefined,
      location: {
        city: city || undefined,
        state: state || undefined,
        country: country || undefined
      }
    };
    
    const result = await onSave(profileData);
    
    if (result.success) {
      setIsEditing(false);
    } else {
      setError(result.error || 'Error al guardar cambios');
    }
    
    setSaving(false);
  };

  // Renderizar campo de texto para modo vista
  const renderField = (label: string, value?: string) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || '-'}</Text>
    </View>
  );

  // Renderizar campo de entrada para modo edición
  const renderInput = (
    label: string, 
    value: string, 
    onChangeText: (text: string) => void,
    placeholder?: string,
    multiline?: boolean
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || `Ingresa tu ${label.toLowerCase()}`}
        multiline={multiline}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabecera con título y botón de edición */}
      <View style={styles.header}>
        <Text style={styles.title}>Información de Perfil</Text>
        {isEditable && !isEditing && (
          <TouchableOpacity onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color={getColorValue(colors.primary)} />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView>
        {isEditing ? (
          // Modo de edición
          <>
            {renderInput('Nombre Completo', fullName, setFullName)}
            {renderInput('Nombre de Usuario', username, setUsername)}
            {renderInput('Biografía', bio, setBio, 'Cuéntanos sobre ti...', true)}
            {renderInput('Teléfono', phoneNumber, setPhoneNumber)}
            {renderInput('Ciudad', city, setCity)}
            {renderInput('Estado/Provincia', state, setState)}
            {renderInput('País', country, setCountry)}
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Text style={styles.buttonText}>Guardando...</Text>
                ) : (
                  <Text style={styles.buttonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Modo de visualización
          <>
            {renderField('Nombre Completo', user.fullName)}
            {renderField('Nombre de Usuario', user.username)}
            {renderField('Email', user.email)}
            {renderField('Biografía', user.bio)}
            {renderField('Teléfono', user.phoneNumber)}
            {renderField('Ubicación', [
              user.location?.city, 
              user.location?.state, 
              user.location?.country
            ].filter(Boolean).join(', '))}
            {renderField('Miembro desde', new Date(user.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: colors.error.main,
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: colors.grey[200],
  },
  saveButton: {
    backgroundColor: getColorValue(colors.primary),
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 