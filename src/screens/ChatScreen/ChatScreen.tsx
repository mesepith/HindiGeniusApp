import React, { useRef } from 'react';
import { View, TextInput, FlatList, Button, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import useRequireAuth from '../../hooks/useRequireAuth';
import Message from '../../components/Message/Message';
import useChat from '../../hooks/useChat';
import styles from './ChatScreen.styles';

const ChatScreen = () => {
  useRequireAuth();
  const { message, setMessage, messages, isLoading, isLoadingMessages, handleSendMessage, flatListRef, isReadyToScroll } = useChat();

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust the offset if needed
    >
      {isLoadingMessages ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Message message={item.message} response={item.response} />}
            onContentSizeChange={() => isReadyToScroll.current && flatListRef.current?.scrollToEnd({ animated: false })}
            onLayout={() => (isReadyToScroll.current = true)}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            {isLoading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Button title="Send" onPress={handleSendMessage} />
            )}
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;