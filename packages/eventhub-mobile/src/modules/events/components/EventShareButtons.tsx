import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { sharingService } from '../../services/sharing.service';
import theme from '../../theme';

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
      <Text style={styles.title}>Compartir evento</Text>
      
      <View style={styles.buttonsRow}>
        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={handleShare}
        >
          <FontAwesome name="share-alt" size={20} color={theme.colors.common.white} />
          <Text style={styles.buttonText}>Compartir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.inviteButton} 
          onPress={handleInvite}
        >
          <FontAwesome name="envelope-o" size={18} color={theme.colors.common.white} />
          <Text style={styles.buttonText}>Invitar</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInviteModal}
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Invitar a {eventName}</Text>
            
            <Text style={styles.modalSubtitle}>Mensaje personalizado (opcional):</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              value={inviteMessage}
              onChangeText={setInviteMessage}
              placeholder="Ej: ¡Hola! Me encantaría que me acompañaras a este evento."
              placeholderTextColor={theme.colors.text.disabled}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowInviteModal(false);
                  setInviteMessage('');
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSend]}
                onPress={sendInvitation}
              >
                <Text style={styles.modalButtonSendText}>Enviar</Text>
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
    marginVertical: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    backgroundColor: theme.colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    marginRight: 8,
  },
  inviteButton: {
    backgroundColor: theme.colors.secondary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: theme.colors.common.white,
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
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.common.black,
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
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.default,
    marginBottom: theme.spacing.md,
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: theme.colors.background.default,
    marginRight: 8,
  },
  modalButtonCancelText: {
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
  modalButtonSend: {
    backgroundColor: theme.colors.primary.main,
    marginLeft: 8,
  },
  modalButtonSendText: {
    color: theme.colors.common.white,
    fontWeight: 'bold',
  },
}); 