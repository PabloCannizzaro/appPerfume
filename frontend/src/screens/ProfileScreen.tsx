// Profile screen with backend preferences and computed style summary.
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../navigation/types';
import PerfumeMiniGrid from '../components/PerfumeMiniGrid';
import { Perfume } from '../types/domain';
import { UserPerfumeLists, UserProfile, UserPreferenceSummary } from '../types/user';
import { usePerfumes } from '../hooks/usePerfumes';
import { usePreferenceActions } from '../hooks/usePreferenceActions';
import { mockUserProfile } from '../data/mockUser';
import { LinearGradient } from 'expo-linear-gradient';

type ProfileNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const sectionsConfig: { key: keyof UserPerfumeLists; title: string }[] = [
  { key: 'likes', title: 'Me gustan' },
  { key: 'dislikes', title: 'No me gustan' },
  { key: 'favorites', title: 'Favoritos' },
  { key: 'wantToTry', title: 'Quiero probar' },
  { key: 'haveIt', title: 'Lo tengo' },
];

const intensityValue: Record<string, number> = {
  suave: 1,
  media: 2,
  fuerte: 3,
  bestia: 4,
};

const USER_ID = 'user-1'; // TODO: reemplazar con auth real

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [draftBio, setDraftBio] = useState(profile.bio ?? '');

  const { perfumes, status: perfumeStatus, error: perfumeError } = usePerfumes();
  const { preferences, loading: prefLoading, error: prefError, refresh } = usePreferenceActions(USER_ID);

  const getPerfumesByIds = (ids: string[]): Perfume[] =>
    ids
      .map((id) => perfumes.find((item) => item.id === id))
      .filter((item): item is Perfume => Boolean(item));

  const likedPerfumes = useMemo(() => getPerfumesByIds(preferences?.likes ?? []), [preferences, perfumes]);

  const preferenceSummary: UserPreferenceSummary = useMemo(() => {
    const tagTotals: Record<string, number> = {};
    likedPerfumes.forEach((perfume) => {
      (perfume.tags ?? []).forEach((tag) => {
        tagTotals[tag] = (tagTotals[tag] ?? 0) + 1;
      });
    });

    const trackedTags = ['fresco', 'citrico', 'amaderado', 'dulce', 'acuatico'];
    const totalTracked = trackedTags.reduce((sum, tag) => sum + (tagTotals[tag] ?? 0), 0);
    const tagPercentages = trackedTags.reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = totalTracked > 0 ? Math.round(((tagTotals[tag] ?? 0) / totalTracked) * 100) : 0;
      return acc;
    }, {});

    const totalIntensityEntries = likedPerfumes.length;
    const intensitySum = likedPerfumes.reduce(
      (sum, p) => sum + (intensityValue[p.sillage ?? (p.averageIntensity as string) ?? ''] ?? 0),
      0,
    );
    const intensityAverage = totalIntensityEntries > 0 ? intensitySum / totalIntensityEntries : 0;

    const seasonTags = ['verano', 'invierno', 'otono', 'primavera'];
    const seasonScores: Record<string, number> = {};
    likedPerfumes.forEach((p) =>
      (p.tags ?? []).forEach((tag) => {
        if (seasonTags.includes(tag)) {
          seasonScores[tag] = (seasonScores[tag] ?? 0) + 1;
        }
      }),
    );
    const preferredSeason = Object.entries(seasonScores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Sin dato';

    return {
      tagPercentages,
      averageIntensity:
        intensityAverage === 0
          ? 'Sin dato'
          : intensityAverage < 1.5
          ? 'Te gustan aromas suaves'
          : intensityAverage < 2.5
          ? 'Te gustan aromas de intensidad media'
          : intensityAverage < 3.5
          ? 'Te gustan aromas intensos'
          : 'Te gustan aromas muy potentes',
      preferredSeason,
    };
  }, [likedPerfumes]);

  const openDetail = (perfumeId: string) => {
    navigation.navigate('PerfumeDetail', { perfumeId });
  };

  const handleSaveProfile = () => {
    setProfile((prev) => ({ ...prev, name: draftName, bio: draftBio }));
    setIsEditing(false);
    // TODO: Call backend API to persist profile changes
  };

  const renderLists = () => {
    if (perfumeStatus === 'loading' || prefLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#111827" />
          <Text>Cargando listas...</Text>
        </View>
      );
    }
    if (perfumeStatus === 'error' || prefError) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{perfumeError ?? prefError ?? 'Error al cargar datos'}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={refresh}>
            <Text style={styles.secondaryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return sectionsConfig.map((section) => {
      const perfumesInList = getPerfumesByIds(preferences?.[section.key] ?? []);
      return (
        <View key={section.key} style={styles.listBlock}>
          <Text style={styles.listTitle}>{section.title}</Text>
          {perfumesInList.length === 0 ? (
            <Text style={styles.emptyText}>Sin perfumes en esta lista.</Text>
          ) : (
            <PerfumeMiniGrid perfumes={perfumesInList} onPressItem={openDetail} />
          )}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#a855f7', '#6366f1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{profile.name}</Text>
            {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis listas</Text>
          {renderLists()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu estilo</Text>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Preferencias por tag</Text>
            <View style={styles.tagRows}>
              {Object.entries(preferenceSummary.tagPercentages).map(([tag, percent]) => (
                <View key={tag} style={styles.statRow}>
                  <Text style={styles.statLabel}>{tag}</Text>
                  <Text style={styles.statValue}>{percent}%</Text>
                </View>
              ))}
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Intensidad promedio</Text>
              <Text style={styles.statValue}>{preferenceSummary.averageIntensity}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Estacion preferida</Text>
              <Text style={styles.statValue}>{preferenceSummary.preferredSeason}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar perfil</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={draftName}
              onChangeText={setDraftName}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripcion corta"
              value={draftBio}
              onChangeText={setDraftBio}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSaveProfile}>
                <Text style={styles.primaryButtonText}>Guardar</Text>
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
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#065f46',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  bio: {
    fontSize: 13,
    color: '#e5e7eb',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  listBlock: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    gap: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 13,
    color: '#6b7280',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    gap: 10,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  tagRows: {
    gap: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#111827',
  },
  statValue: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    color: '#111827',
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '700',
  },
  center: {
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: '#ef4444',
  },
});

export default ProfileScreen;
