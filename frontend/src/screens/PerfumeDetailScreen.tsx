// Detailed view for a perfume using backend data and preference/review actions.
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import RatingStars from '../components/RatingStars';
import UsageTags from '../components/UsageTags';
import { Perfume, Review } from '../types/domain';
import { get, post } from '../services/api';
import { usePreferenceActions } from '../hooks/usePreferenceActions';

type Props = NativeStackScreenProps<RootStackParamList, 'PerfumeDetail'>;

const placeholderImage = 'https://via.placeholder.com/800x600.png?text=Perfume';
const USER_ID = 'user-1'; // TODO: reemplazar con usuario autenticado real

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
  const { performAction } = usePreferenceActions(USER_ID);
  const [perfume, setPerfume] = useState<Perfume | null>(null);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingReview, setSavingReview] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [detail, reviewList] = await Promise.all([
        get<Perfume>(`perfumes/${perfumeId}`),
        get<Review[]>(`perfumes/${perfumeId}/reviews`),
      ]);
      setPerfume(detail);
      setReviews(reviewList.map((r, idx) => ({ ...r, id: r.id ?? `rev-${idx}`, date: (r as any).createdAt })));
      setUserRating(detail.averageRating ?? detail.ratingAverage ?? 0);
    } catch (err: any) {
      setError(err.message || 'No se pudo cargar el perfume');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [perfumeId]);

  const toggleAction = async (key: ActionKey) => {
    setUserActions((prev) => ({ ...prev, [key]: !prev[key] }));
    try {
      await performAction(perfumeId, key as any);
    } catch (err) {
      // Swallow error; UI already updated. TODO: surface global toast
    }
  };

  const handleSubmitReview = async () => {
    if (!userRating || !userComment.trim()) {
      Alert.alert('Falta informacion', 'Agrega rating y comentario antes de guardar.');
      return;
    }
    setSavingReview(true);
    try {
      await post(`perfumes/${perfumeId}/reviews`, { userId: USER_ID, rating: userRating, comment: userComment });
      setUserComment('');
      await fetchData();
      Alert.alert('Listo', 'Tu review se envio.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo enviar la review');
    } finally {
      setSavingReview(false);
    }
  };

  const notes = useMemo(() => {
    const rawNotes = (perfume as any)?.notes;
    const top = Array.isArray(rawNotes) ? rawNotes : rawNotes?.top ?? [];
    const heart = Array.isArray(rawNotes) ? [] : rawNotes?.heart ?? [];
    const base = Array.isArray(rawNotes) ? [] : rawNotes?.base ?? [];
    return [
      { label: 'Salida', values: perfume?.topNotes ?? top },
      { label: 'Corazon', values: perfume?.heartNotes ?? heart },
      { label: 'Fondo', values: perfume?.baseNotes ?? base },
    ];
  }, [perfume]);

  if (loading) {
    return (
      <View style={styles.emptyState}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.heading}>Cargando perfume...</Text>
      </View>
    );
  }

  if (error || !perfume) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.heading}>No se encontro el perfume</Text>
        {error ? <Text style={styles.meta}>{error}</Text> : null}
      </View>
    );
  }

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const usageTags = perfume.usage
    ? perfume.usage
    : perfume.usageStats
    ? Object.keys(perfume.usageStats)
    : [];
  const buyLinks = perfume.buyLinks ?? (perfume.externalLinks ?? []).map((url, i) => ({ label: `Ver en tienda ${i + 1}`, url }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {perfume.imageUrl ? (
        <Image source={{ uri: perfume.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>{perfume.name}</Text>
        <Text style={styles.subtitle}>
          {perfume.brand} {perfume.concentration ? `- ${perfume.concentration}` : ''}
        </Text>
        <Text style={styles.meta}>
          {perfume.family} {perfume.launchYear || perfume.year ? `- ${perfume.launchYear ?? perfume.year}` : ''}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas</Text>
        <View style={styles.notesRow}>
          {notes.map((item) => (
            <View key={item.label} style={styles.notesBlock}>
              <Text style={styles.notesLabel}>{item.label}</Text>
              <Text style={styles.notesText}>{Array.isArray(item.values) ? item.values.join(', ') : 'Sin datos'}</Text>
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
              <RatingStars value={perfume.ratingAverage ?? perfume.averageRating ?? 0} />
              <Text style={styles.statText}>({perfume.ratingCount ?? 0})</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Duracion</Text>
            <Text style={styles.statText}>
              {perfume.longevity ?? (perfume.averageLongevityHours ? `${perfume.averageLongevityHours}h` : 'Sin dato')}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Intensidad</Text>
            <Text style={styles.statText}>{perfume.sillage ?? perfume.averageIntensity ?? 'Sin dato'}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Uso ideal</Text>
            <UsageTags tags={perfume.usage ?? usageTags} />
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
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmitReview} disabled={savingReview}>
            <Text style={styles.primaryButtonText}>{savingReview ? 'Guardando...' : 'Guardar'}</Text>
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
            <Text style={styles.reviewDate}>{review.date ?? (review as any).createdAt}</Text>
            <Text style={styles.reviewText}>{review.comment}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Donde se puede comprar</Text>
        {buyLinks.map((link) => (
          <TouchableOpacity key={link.url} style={styles.secondaryButton} onPress={() => openLink(link.url)}>
            <Text style={styles.secondaryButtonText}>{link.label}</Text>
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
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#6b7280',
    fontWeight: '600',
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
    gap: 8,
  },
});

export default PerfumeDetailScreen;
