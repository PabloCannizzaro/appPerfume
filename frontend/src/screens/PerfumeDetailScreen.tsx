// Detailed view for a perfume with stats, notes, and actions.
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getPerfumeDetail, getPerfumeReviews, PerfumeDetail } from '../services/perfumeDetails';
import RatingStars from '../components/RatingStars';
import UsageTags from '../components/UsageTags';
import { Review } from '../types/domain';

type Props = NativeStackScreenProps<RootStackParamList, 'PerfumeDetail'>;

const placeholderImage = 'https://via.placeholder.com/800x600.png?text=Perfume';

const actionOptions = [
  { key: 'like', label: 'Me gusta' },
  { key: 'dislike', label: 'No me gusta' },
  { key: 'favorite', label: 'Favorito' },
  { key: 'wishlist', label: 'Quiero probar' },
  { key: 'owned', label: 'Lo tengo' },
] as const;

type ActionKey = (typeof actionOptions)[number]['key'];

const PerfumeDetailScreen: React.FC<Props> = ({ route }) => {
  const { perfumeId } = route.params;
  const [perfume, setPerfume] = useState<PerfumeDetail | undefined>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>('');
  const [userActions, setUserActions] = useState<Record<ActionKey, boolean>>({
    like: false,
    dislike: false,
    favorite: false,
    wishlist: false,
    owned: false,
  });

  useEffect(() => {
    const detail = getPerfumeDetail(perfumeId);
    setPerfume(detail);
    setReviews(getPerfumeReviews(perfumeId));
    setUserRating(detail?.ratingAverage ?? 0);
  }, [perfumeId]);

  const toggleAction = (key: ActionKey) => {
    setUserActions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // TODO: Call backend API to persist user preference action
      return next;
    });
  };

  const handleSubmitReview = () => {
    // TODO: send review to backend
    console.log('Send review', { perfumeId, rating: userRating, comment: userComment });
    Alert.alert('Guardado', 'Tu opinion se guardo en el estado local (mock).');
  };

  const notes = useMemo(() => {
    return [
      { label: 'Salida', values: perfume?.topNotes ?? [] },
      { label: 'Corazon', values: perfume?.heartNotes ?? [] },
      { label: 'Fondo', values: perfume?.baseNotes ?? [] },
    ];
  }, [perfume]);

  if (!perfume) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.heading}>No se encontro el perfume</Text>
      </View>
    );
  }

  const openLink = (url: string) => {
    // In a future version, validate URL and track analytics before opening
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={{ uri: perfume.imageUrl || placeholderImage }} style={styles.image} />

      <View style={styles.header}>
        <Text style={styles.title}>{perfume.name}</Text>
        <Text style={styles.subtitle}>
          {perfume.brand} {perfume.concentration ? `- ${perfume.concentration}` : ''}
        </Text>
        <Text style={styles.meta}>
          {perfume.family} {perfume.launchYear ? `- ${perfume.launchYear}` : ''}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas</Text>
        <View style={styles.notesRow}>
          {notes.map((item) => (
            <View key={item.label} style={styles.notesBlock}>
              <Text style={styles.notesLabel}>{item.label}</Text>
              <Text style={styles.notesText}>{item.values.join(', ') || 'Sin datos'}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadisticas de la comunidad</Text>
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Rating promedio</Text>
            <View style={styles.statValueRow}>
              <RatingStars value={perfume.ratingAverage ?? 0} />
              <Text style={styles.statText}>({perfume.ratingCount ?? 0})</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Duracion</Text>
            <Text style={styles.statText}>{perfume.longevity ?? 'Sin dato'}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Intensidad</Text>
            <Text style={styles.statText}>{perfume.sillage ?? 'Sin dato'}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Uso ideal</Text>
            <UsageTags tags={perfume.usage} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu opinion</Text>
        <View style={styles.userCard}>
          <Text style={styles.userLabel}>Calificar</Text>
          <RatingStars value={userRating} editable onChange={setUserRating} size={22} />
          <TextInput
            style={styles.input}
            placeholder="Escribe un comentario corto"
            value={userComment}
            onChangeText={setUserComment}
            multiline
          />
          <View style={styles.actionsRow}>
            {actionOptions.map((action) => {
              const active = userActions[action.key];
              return (
                <TouchableOpacity
                  key={action.key}
                  style={[styles.actionPill, active && styles.actionPillActive]}
                  onPress={() => toggleAction(action.key)}
                >
                  <Text style={[styles.actionPillText, active && styles.actionPillTextActive]}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmitReview}>
            <Text style={styles.primaryButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comentarios recientes</Text>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewName}>{review.userName ?? 'Usuario'}</Text>
              <RatingStars value={review.rating} size={14} />
            </View>
            <Text style={styles.reviewDate}>{review.date}</Text>
            <Text style={styles.reviewText}>{review.comment}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Donde se puede comprar</Text>
        {(perfume.externalLinks ?? []).map((link, index) => (
          <TouchableOpacity key={link} style={styles.secondaryButton} onPress={() => openLink(link)}>
            <Text style={styles.secondaryButtonText}>Ver en tienda {index === 0 ? 'A' : 'B'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#e5e7eb',
  },
  header: {
    padding: 16,
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  meta: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  notesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  notesBlock: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  notesLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '700',
  },
  notesText: {
    fontSize: 14,
    color: '#111827',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 10,
  },
  userLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    color: '#111827',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionPill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  actionPillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  actionPillTextActive: {
    color: '#fff',
  },
  primaryButton: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    gap: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  reviewText: {
    fontSize: 14,
    color: '#111827',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '700',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
});

export default PerfumeDetailScreen;
