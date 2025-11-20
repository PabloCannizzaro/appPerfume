// AI hub: chat and guided test using backend contracts (mocked for now).
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { AIChatResponse, AITestAnswers, AITestResponse } from '../types/ai';
import { sendChatMessage, sendTestAnswers } from '../services/aiService';
import PerfumeMiniCard from '../components/PerfumeMiniCard';
import { Perfume } from '../types/domain';

type AiNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'AI'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type ChatMessage = {
  id: string;
  from: 'user' | 'ai';
  text: string;
  recommendations?: Perfume[];
};

const testQuestions: { key: keyof AITestAnswers; question: string; options: { value: AITestAnswers[keyof AITestAnswers]; label: string }[] }[] = [
  {
    key: 'timeOfDay',
    question: 'Momento de uso',
    options: [
      { value: 'dia', label: 'Dia' },
      { value: 'noche', label: 'Noche' },
      { value: 'ambos', label: 'Ambos' },
    ],
  },
  {
    key: 'season',
    question: 'Estacion preferida',
    options: [
      { value: 'verano', label: 'Verano' },
      { value: 'invierno', label: 'Invierno' },
      { value: 'primavera', label: 'Primavera' },
      { value: 'otono', label: 'Otono' },
      { value: 'todo-ano', label: 'Todo el ano' },
    ],
  },
  {
    key: 'scentStyle',
    question: 'Estilo de aroma',
    options: [
      { value: 'fresco', label: 'Fresco' },
      { value: 'citrico', label: 'Citrico' },
      { value: 'dulce', label: 'Dulce' },
      { value: 'amaderado', label: 'Amaderado' },
      { value: 'acuatico', label: 'Acuatico' },
    ],
  },
  {
    key: 'intensity',
    question: 'Intensidad preferida',
    options: [
      { value: 'suave', label: 'Suave' },
      { value: 'media', label: 'Media' },
      { value: 'fuerte', label: 'Fuerte' },
    ],
  },
  {
    key: 'usage',
    question: 'Uso principal',
    options: [
      { value: 'oficina', label: 'Oficina' },
      { value: 'cita', label: 'Cita' },
      { value: 'diario', label: 'Uso diario' },
      { value: 'fiesta', label: 'Fiesta' },
    ],
  },
];

const AiScreen: React.FC = () => {
  const navigation = useNavigation<AiNavProp>();
  const [activeTab, setActiveTab] = useState<'chat' | 'test'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      from: 'ai',
      text: 'Hola, soy tu guia de perfumes. Contame que buscas y te recomiendo.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [answers, setAnswers] = useState<AITestAnswers>({});
  const [testIndex, setTestIndex] = useState(0);
  const [testResult, setTestResult] = useState<AITestResponse | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const chatListRef = useRef<FlatList<ChatMessage>>(null);

  const isLastQuestion = testIndex === testQuestions.length - 1;

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = { id: `u-${Date.now()}`, from: 'user', text: chatInput };
    setMessages((prev) => [...prev, newMessage]);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await sendChatMessage({ userId: 'user-1', message: newMessage.text });
      appendAiMessage(response);
    } finally {
      setChatLoading(false);
    }
  };

  const appendAiMessage = (response: AIChatResponse) => {
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      from: 'ai',
      text: response.replyText,
      recommendations: response.recommendations,
    };
    setMessages((prev) => [...prev, aiMessage]);
    setTimeout(() => chatListRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const selectAnswer = (key: keyof AITestAnswers, value: AITestAnswers[keyof AITestAnswers]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (!isLastQuestion) {
      setTestIndex((prev) => prev + 1);
      return;
    }
    setTestLoading(true);
    try {
      const result = await sendTestAnswers({ userId: 'user-1', answers });
      setTestResult(result);
    } finally {
      setTestLoading(false);
    }
  };

  const handlePrev = () => {
    if (testIndex === 0) return;
    setTestIndex((prev) => prev - 1);
  };

  const resetTest = () => {
    setAnswers({});
    setTestIndex(0);
    setTestResult(null);
  };

  const currentQuestion = testQuestions[testIndex];

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageBubble, item.from === 'user' ? styles.userBubble : styles.aiBubble]}>
      <Text style={styles.messageText}>{item.text}</Text>
      {item.recommendations && item.recommendations.length > 0 ? (
        <View style={styles.recsContainer}>
          <Text style={styles.recsTitle}>Recomendaciones:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {item.recommendations.map((perfume) => (
              <PerfumeMiniCard
                key={perfume.id}
                perfume={perfume}
                width={160}
                onPress={() => navigation.navigate('PerfumeDetail', { perfumeId: perfume.id })}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );

  const ChatTab = () => (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.chatContainer}>
        <FlatList
          ref={chatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 12, gap: 10 }}
          onContentSizeChange={() => chatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Describe lo que buscas..."
            value={chatInput}
            onChangeText={setChatInput}
            editable={!chatLoading}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={chatLoading}>
            <Text style={styles.sendButtonText}>{chatLoading ? '...' : 'Enviar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const TestTab = () => (
    <View style={styles.flex1}>
      {testResult ? (
        <ScrollView contentContainerStyle={{ padding: 12, gap: 12 }}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <Text style={styles.summaryText}>{testResult.summaryText}</Text>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <View style={{ gap: 10 }}>
            {testResult.recommendations.map((perfume) => (
              <PerfumeMiniCard
                key={perfume.id}
                perfume={perfume}
                width={180}
                onPress={() => navigation.navigate('PerfumeDetail', { perfumeId: perfume.id })}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.secondaryButton} onPress={resetTest}>
            <Text style={styles.secondaryButtonText}>Hacer otro test</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.testContainer}>
          <Text style={styles.questionTitle}>{currentQuestion.question}</Text>
          <View style={styles.optionsGrid}>
            {currentQuestion.options.map((opt) => {
              const selected = answers[currentQuestion.key] === opt.value;
              return (
                <TouchableOpacity
                  key={`${currentQuestion.key}-${opt.value}`}
                  style={[styles.optionChip, selected && styles.optionChipSelected]}
                  onPress={() => selectAnswer(currentQuestion.key, opt.value)}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.testActions}>
            <TouchableOpacity style={[styles.navButton, testIndex === 0 && styles.navButtonDisabled]} onPress={handlePrev} disabled={testIndex === 0}>
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={handleNext} disabled={testLoading}>
              <Text style={styles.navButtonText}>{testLoading ? '...' : isLastQuestion ? 'Finalizar' : 'Siguiente'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {['chat', 'test'].map((tab) => {
          const selected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, selected && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab as 'chat' | 'test')}
            >
              <Text style={[styles.tabText, selected && styles.tabTextActive]}>{tab === 'chat' ? 'Chat' : 'Test'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {activeTab === 'chat' ? <ChatTab /> : <TestTab />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  flex1: { flex: 1 },
  tabRow: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#111827',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  tabTextActive: {
    color: '#fff',
  },
  chatContainer: {
    flex: 1,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '90%',
  },
  userBubble: {
    backgroundColor: '#d1fae5',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#111827',
  },
  recsContainer: {
    marginTop: 8,
    gap: 6,
  },
  recsTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sendButton: {
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#111827',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  testContainer: {
    flex: 1,
    padding: 12,
    gap: 16,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
  },
  optionChipSelected: {
    backgroundColor: '#111827',
  },
  optionText: {
    fontWeight: '700',
    color: '#111827',
  },
  optionTextSelected: {
    color: '#fff',
  },
  testActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 14,
    color: '#111827',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: '700',
    color: '#111827',
  },
});

export default AiScreen;
