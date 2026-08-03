import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// ⚠️ Make sure your key is directly inside quotes without extra spaces
const GEMINI_API_KEY = "AQ.Ab8RN6ILwYZeVkj42IOhV6GNv-mC_7GFVLqBv2E5Wf9YNBSm3g"; // <--- Replace with your full key

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am your AI assistant. Ask me anything!', sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Pass key in BOTH URL query and Header for full key format compatibility
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }]
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const aiResponseText = data.candidates[0].content.parts[0].text;
        const aiMsg = { id: Date.now() + 1, text: aiResponseText.trim(), sender: 'ai' };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Display exact API error returned by Google
        const apiErrorReason = data?.error?.message || `HTTP Error ${response.status}`;
        throw new Error(apiErrorReason);
      }
    } catch (error) {
      console.error('API Request Error:', error);
      const errorMsg = { 
        id: Date.now() + 1, 
        text: `⚠️ Error: ${error.message}`, 
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

      <ScrollView 
        style={styles.chatContainer} 
        contentContainerStyle={{ paddingBottom: 20 }}
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
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <ActivityIndicator size="small" color="#6200ee" />
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
          style={[styles.sendButton, loading && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    paddingTop: 50, 
    paddingBottom: 15, 
    backgroundColor: '#6200ee', 
    alignItems: 'center' 
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chatContainer: { flex: 1, padding: 16 },
  messageBubble: { padding: 12, borderRadius: 12, marginBottom: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: '#6200ee', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  userText: { color: '#fff', fontSize: 16 },
  aiText: { color: '#000', fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16 },
  sendButton: { justifyContent: 'center', alignItems: 'center', marginLeft: 10, backgroundColor: '#6200ee', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12 },
  sendButtonDisabled: { backgroundColor: '#a580e8' },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
