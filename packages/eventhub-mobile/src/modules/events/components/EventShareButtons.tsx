import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { sharingService } from '@modules/social/services/sharing.service';
import { useTheme } from '@core/context/ThemeContext';

interface EventShareButtonsProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
}

export const EventShareButtons: React.FC<EventShareButtonsProps> = ({
  eventId,
  eventName,
  eventDate,
  eventLocation,
}) => {
  const { theme } = useTheme();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  
  const handleShare = async () => {
    try {
      await sharingService.shareEvent(eventId, eventName, eventDate, eventLocation);
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el evento. Inténtalo de nuevo.');
      console.error(error);
    }
  };
  
  const handleInvite = () => {
    setShowInviteModal(true);
  };
  
  const sendInvitation = async () => {
    try {
      await sharingService.shareInvitation(eventId, eventName, eventDate, inviteMessage);
      setShowInviteModal(false);
      setInviteMessage('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la invitación. Inténtalo de nuevo.');
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Compartir evento</Text>
      
      <View style={styles.buttonsRow}>
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: theme.colors.primary.main }]} 
          onPress={handleShare}
        >
          <FontAwesome name="share-alt" size={20} color={theme.colors.common.white} />
          <Text style={[styles.buttonText, { color: theme.colors.common.white }]}>Compartir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.inviteButton, { backgroundColor: theme.colors.secondary.main }]} 
          onPress={handleInvite}
        >
          <FontAwesome name="envelope-o" size={18} color={theme.colors.common.white} />
          <Text style={[styles.buttonText, { color: theme.colors.common.white }]}>Invitar</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInviteModal}
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.background.paper }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>Invitar a {eventName}</Text>
            
            <Text style={[styles.modalSubtitle, { color: theme.colors.text.secondary }]}>Mensaje personalizado (opcional):</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  borderColor: theme.colors.border.main, 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.background.default 
                }
              ]}
              multiline
              numberOfLines={4}
              value={inviteMessage}
              onChangeText={setInviteMessage}
              placeholder="Ej: ¡Hola! Me encantaría que me acompañaras a este evento."
              placeholderTextColor={theme.colors.text.disabled}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.modalButtonCancel,
                  { backgroundColor: theme.colors.background.default }
                ]}
                onPress={() => {
                  setShowInviteModal(false);
                  setInviteMessage('');
                }}
              >
                <Text style={[styles.modalButtonCancelText, { color: theme.colors.text.primary }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.modalButtonSend,
                  { backgroundColor: theme.colors.primary.main }
                ]}
                onPress={sendInvitation}
              >
                <Text style={[styles.modalButtonSendText, { color: theme.colors.common.white }]}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonCancel: {
    marginRight: 8,
  },
  modalButtonCancelText: {
    fontWeight: 'bold',
  },
  modalButtonSend: {
    marginLeft: 8,
  },
  modalButtonSendText: {
    fontWeight: 'bold',
  },
}); 