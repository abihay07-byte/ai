import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// ⚠️ REPLACE THIS WITH YOUR ACTUAL GEMINI API KEY
const GEMINI_API_KEY = "AQ.Ab8RN6K1qGNb_3E8w9Yx9skNFRfpfC0um_ZkN9zNQtazPqHzCw"; 

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I am your AI assistant. Ask me anything!', sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    const userMsg = { id: Date.now().toString(), text: userText, sender: 'user' };

    // 1. Add User message to chat
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // 2. Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }]
          })
        }
      );

      const data = await response.json();
      
      let aiResponseText = "Sorry, I couldn't generate a response. Please check your API key or connection.";

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        aiResponseText = data.candidates[0].content.parts[0].text.trim();
      }

      // 3. Add AI Response to chat
      const aiMsg = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg = { 
        id: (Date.now() + 1).toString(), 
        text: "Error connecting to AI service. Please check your internet connection.", 
        sender: 'ai' 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Real AI Chatbot</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          style={styles.chatContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
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

          {loading && (
            <View style={[styles.messageBubble, styles.aiBubble, styles.loadingBubble]}>
              <ActivityIndicator size="small" color="#6200ee" />
              <Text style={[styles.aiText, { marginLeft: 8 }]}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            editable={!loading}
          />
          <TouchableOpacity 
            style={[styles.sendButton, loading && styles.disabledButton]} 
            onPress={sendMessage}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  keyboardContainer: { flex: 1 },
  header: { padding: 16, backgroundColor: '#6200ee', alignItems: 'center', paddingTop: 40 },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chatContainer: { flex: 1, padding: 16 },
  messageBubble: { padding: 12, borderRadius: 12, marginBottom: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: '#6200ee', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  loadingBubble: { flexDirection: 'row', alignItems: 'center' },
  userText: { color: '#fff', fontSize: 15 },
  aiText: { color: '#000', fontSize: 15 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#fafafa' },
  sendButton: { justifyContent: 'center', alignItems: 'center', marginLeft: 10, backgroundColor: '#6200ee', borderRadius: 20, paddingHorizontal: 20 },
  disabledButton: { backgroundColor: '#aaa' },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});
