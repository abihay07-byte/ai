import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulated AI response
    setTimeout(() => {
      const aiMsg = { id: Date.now() + 1, text: 'This is a response from your AI bot!', sender: 'ai' };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Chatbot</Text>
      </View>

      <ScrollView style={styles.chatContainer}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.aiBubble
            ]}
          >
            <Text style={msg.sender === 'user' ? styles.userText : styles.aiText}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#6200ee', alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chatContainer: { flex: 1, padding: 16 },
  messageBubble: { padding: 12, borderRadius: 8, marginBottom: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: '#6200ee', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  userText: { color: '#fff' },
  aiText: { color: '#000' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8 },
  sendButton: { justifyContent: 'center', alignItems: 'center', marginLeft: 10, backgroundColor: '#6200ee', borderRadius: 20, paddingHorizontal: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});
