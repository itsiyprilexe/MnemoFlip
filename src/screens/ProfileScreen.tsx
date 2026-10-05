import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  Modal,
  KeyboardAvoidingView,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStorage } from '../context/StorageContext';
import { radius, spacing, scoreColor, scoreSoft } from '../theme';

const initialsOf = (name?: string) => {
  const parts = (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return 'S';

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

const capitalizeWords = (str?: string) => {
  if (!str) return '';
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const ProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logOut, updateUser } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { decks, quizzes, highScores, resetToStaticDefaults } = useStorage();

  const totalCards = useMemo(
    () => decks.reduce((sum, d) => sum + d.cards.length, 0),
    [decks],
  );

  const averageScore = useMemo(() => {
    if (!highScores.length) return 0;
    const totalPct = highScores.reduce(
      (sum, s) =>
        sum +
        (s.totalQuestions > 0
          ? Math.round((s.score / s.totalQuestions) * 100)
          : 0),
      0,
    );
    return Math.round(totalPct / highScores.length);
  }, [highScores]);

  // Photo state
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Bio states
  const DEFAULT_BIO =
    'KAHUSAY KO!';
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [editBio, setEditBio] = useState(DEFAULT_BIO);
  const [bioModalVisible, setBioModalVisible] = useState(false);

  // Edit Profile / Photo states
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [tempPhotoUri, setTempPhotoUri] = useState<string | null>(null);

  // Open Edit Profile modal (edits photo & name)
  const openEditProfileModal = () => {
    setEditName(user?.name ? capitalizeWords(user.name) : '');
    setTempPhotoUri(photoUri);
    setProfileModalVisible(true);
  };

  // Change Photo button inside modal
  const handlePickPhoto = () => {
    Alert.alert(
      'Demo Profile',
      'Photo upload is disabled in static prototype mode.',
    );
  };

  const handleRemovePhoto = () => {
    setTempPhotoUri(null);
  };

  const handleSaveProfile = async () => {
    const cleanName = editName.trim();
    if (!cleanName) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }

    await updateUser(cleanName);
    setPhotoUri(tempPhotoUri);
    setProfileModalVisible(false);
  };

  const openEditBioModal = () => {
    setEditBio(bio);
    setBioModalVisible(true);
  };

  const handleSaveBio = async () => {
    const cleanBio = editBio.trim();
    setBio(cleanBio);
    setBioModalVisible(false);
  };

  // Account button
  const handleAccountPress = () => {
    Alert.alert(
      'Static Account',
      `Signed in as static user: ${user?.name || 'Alex Rivera'} (${user?.email || 'alex.rivera@example.com'})`,
    );
  };

  // Privacy button
  const handlePrivacyPress = () => {
    Alert.alert(
      'Privacy Policy',
      'This application runs in static prototype mode. All data is mock and in-memory.',
    );
  };

  // Help and feedback button
  const handleHelpPress = () => {
    Alert.alert(
      'FlashCard App',
      'Study flashcards, review decks, and practice with quizzes in this static prototype.',
    );
  };

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logOut() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 110,
          },
        ]}
      >
        {/* =========================
            PROFILE HEADER (CLEAN, NO CARD ENCLOSURE)
        ========================= */}
        <View style={styles.profileSection}>
          {/* Upper row: "Edit photo" button positioned on upper right */}
          <View style={styles.profileTopRow}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.editPhotoTopBtn}
              onPress={openEditProfileModal}
              activeOpacity={0.7}
              accessibilityLabel="Edit photo and name"
            >
              <Ionicons
                name="camera-outline"
                size={15}
                color={colors.primary}
              />
              <Text style={styles.editPhotoTopBtnText}>Edit photo</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Icon / Avatar (Enlarged, no camera badge overlay) */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={openEditProfileModal}
              activeOpacity={0.85}
              accessibilityLabel="Change profile picture"
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{initialsOf(user?.name)}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Centered User Name (no pencil icon) */}
          <Text style={styles.name} numberOfLines={1}>
            {user?.name ? capitalizeWords(user.name) : 'User'}
          </Text>

          {/* Bio Display (Direct clean text, NO CARD) */}
          {!!bio && (
            <Text style={styles.bioText}>{bio}</Text>
          )}

          {/* Edit Bio Button */}
          <TouchableOpacity
            style={styles.editBioBtn}
            onPress={openEditBioModal}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={14} color={colors.primary} />
            <Text style={styles.editBioBtnText}>
              {bio ? 'Edit bio' : 'Add bio'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* =========================
            STUDY STATS (STATIC SUMMARY)
        ========================= */}
        

        {/* =========================
            RECENT QUIZ ACTIVITY (STATIC)
        ========================= */}
        

        {/* =========================
            SETTINGS CARD (ACCOUNT, PRIVACY, HELP & FEEDBACK)
        ========================= */}
        <View style={styles.settingsCard}>
          {/* Account */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleAccountPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: colors.primarySoft },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={19}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.settingLabel}>Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          {/* Privacy */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handlePrivacyPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: '#ECFDF5' },
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={19}
                  color="#10B981"
                />
              </View>
              <Text style={styles.settingLabel}>Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          {/* Help and feedback */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleHelpPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: '#EFF6FF' },
                ]}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={19}
                  color="#3B82F6"
                />
              </View>
              <Text style={styles.settingLabel}>Help and feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          {/* App Version Row */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: '#F3F4F6' },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={19}
                  color={colors.muted}
                />
              </View>
              <Text style={styles.settingLabel}>Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>

          <View style={styles.settingDivider} />

          {/* Logout Action Row */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={confirmLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: '#FEF2F2' },
                ]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={19}
                  color="#EF4444"
                />
              </View>
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>
                Log Out
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* =========================
          EDIT PROFILE & PHOTO MODAL
      ========================= */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setProfileModalVisible(false)}
          />
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 16) + 12 },
            ]}
          >
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.modalSubtitle}>
              Update your photo and display name
            </Text>

            {/* Photo Preview & Options */}
            <View style={styles.modalPhotoRow}>
              <View style={styles.modalAvatar}>
                {tempPhotoUri ? (
                  <Image
                    source={{ uri: tempPhotoUri }}
                    style={styles.modalAvatarImage}
                  />
                ) : (
                  <Text style={styles.modalAvatarText}>
                    {initialsOf(editName || user?.name)}
                  </Text>
                )}
              </View>

              <View style={styles.modalPhotoActions}>
                <TouchableOpacity
                  style={styles.photoActionBtn}
                  onPress={handlePickPhoto}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="image-outline"
                    size={16}
                    color={colors.primary}
                  />
                  <Text style={styles.photoActionBtnText}>
                    {tempPhotoUri ? 'Change Photo' : 'Upload Photo'}
                  </Text>
                </TouchableOpacity>

                {tempPhotoUri && (
                  <TouchableOpacity
                    style={styles.removePhotoBtn}
                    onPress={handleRemovePhoto}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    <Text style={styles.removePhotoBtnText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Name Input */}
            <Text style={styles.modalLabel}>Display Name</Text>
            <TextInput
              style={styles.nameInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              maxLength={40}
              autoCapitalize="words"
            />

            <View style={styles.modalButtons}>
              <PrimaryButton
                title="Cancel"
                variant="secondary"
                onPress={() => setProfileModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton
                title="Save"
                onPress={handleSaveProfile}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* =========================
          EDIT BIO BOTTOM SHEET MODAL
      ========================= */}
      <Modal
        visible={bioModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBioModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setBioModalVisible(false)}
          />
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 16) + 12 },
            ]}
          >
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Edit Bio</Text>
            <Text style={styles.modalSubtitle}>
              Write a short note about your study goals
            </Text>

            <TextInput
              style={styles.bioInput}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="e.g. Studying for biology exams & vocabulary..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={120}
            />
            <Text style={styles.charCount}>{editBio.length} / 120</Text>

            <View style={styles.modalButtons}>
              <PrimaryButton
                title="Cancel"
                variant="secondary"
                onPress={() => setBioModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton
                title="Save Bio"
                onPress={handleSaveBio}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    scrollContent: {
      paddingHorizontal: spacing.md,
    },

    // ── STUDY STATS (STATIC SUMMARY) ────────────────────────────────────────
    statsCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: 8,
      marginBottom: 20,
      marginTop: 2,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },
        android: { elevation: 2 },
      }),
    },

    statItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    statValue: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.heading,
      letterSpacing: -0.3,
    },

    statLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.muted,
      marginTop: 2,
    },

    statDivider: {
      width: 1,
      height: 28,
      backgroundColor: colors.border,
    },

    // ── PROFILE HEADER (OPEN, NO CARD) ──────────────────────────────────────
    profileSection: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      paddingTop: 4,
      paddingBottom: 22,
    },

    profileTopRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      marginBottom: 8,
    },

    editPhotoTopBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.card,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        android: { elevation: 2 },
      }),
    },

    editPhotoTopBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
    },

    avatarContainer: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },

    avatar: {
      width: 128,
      height: 128,
      borderRadius: 64,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      overflow: 'hidden',
      borderWidth: 4,
      borderColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.22,
          shadowRadius: 14,
        },
        android: { elevation: 6 },
      }),
    },

    avatarImage: {
      width: 128,
      height: 128,
      borderRadius: 64,
    },

    avatarText: {
      fontSize: 48,
      fontWeight: '900',
      color: '#FFFFFF',
      textAlign: 'center',
      textAlignVertical: 'center',
      includeFontPadding: false,
      alignSelf: 'center',
      lineHeight: Platform.OS === 'android' ? 56 : 52,
      transform: [{ translateY: Platform.OS === 'android' ? 2 : 4 }],
    },

    name: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.heading,
      letterSpacing: -0.4,
      textAlign: 'center',
      alignSelf: 'center',
      marginTop: 2,
      marginBottom: 4,
      paddingHorizontal: 16,
    },

    bioText: {
      fontSize: 14,
      color: colors.muted,
      textAlign: 'center',
      alignSelf: 'center',
      lineHeight: 20,
      marginTop: 6,
      marginBottom: 4,
      paddingHorizontal: 24,
      maxWidth: 320,
    },

    editBioBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: radius.pill,
      marginTop: 10,
      alignSelf: 'center',
    },

    editBioBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
    },

    // ── SECTION HEADER ──────────────────────────────────────────────────────
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 6,
      paddingHorizontal: 4,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.heading,
      letterSpacing: -0.2,
    },

    sectionSubtitle: {
      fontSize: 12,
      color: colors.muted,
      fontWeight: '500',
    },

    // ── RECENT QUIZZES CARD LIST ─────────────────────────────────────────────
    quizList: {
      gap: 9,
      marginBottom: 20,
    },

    scoreCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 12,
      paddingHorizontal: 14,
      gap: 12,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },
        android: { elevation: 1 },
      }),
    },

    scoreCardIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
    },

    scoreCardInfo: {
      flex: 1,
    },

    scoreDeckTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.heading,
    },

    scoreDate: {
      fontSize: 11,
      color: colors.muted,
      marginTop: 2,
    },

    scoreBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.pill,
    },

    scoreBadgeText: {
      fontSize: 12,
      fontWeight: '700',
    },

    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      marginBottom: 20,
    },

    emptyIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },

    emptyTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.heading,
    },

    emptyText: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 4,
      textAlign: 'center',
      lineHeight: 18,
      maxWidth: 260,
    },

    emptyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: radius.pill,
      marginTop: 14,
    },

    emptyButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
    },

    // ── SETTINGS CARD ────────────────────────────────────────────────────────
    settingsCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 6,
      marginBottom: 24,
      marginTop: 4,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        android: { elevation: 2 },
      }),
    },

    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },

    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    settingIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },

    settingLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.heading,
    },

    versionText: {
      fontSize: 13,
      color: colors.muted,
      fontWeight: '600',
    },

    settingDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },

    // ── MODAL STYLES ─────────────────────────────────────────────────────────
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(30,27,75,0.5)',
      justifyContent: 'flex-end',
    },

    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 12,
    },

    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginBottom: 14,
    },

    modalTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.heading,
      marginBottom: 4,
    },

    modalSubtitle: {
      fontSize: 13,
      color: colors.muted,
      marginBottom: 16,
      lineHeight: 18,
    },

    modalPhotoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 18,
    },

    modalAvatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    modalAvatarImage: {
      width: 72,
      height: 72,
      borderRadius: 36,
    },

    modalAvatarText: {
      fontSize: 28,
      fontWeight: '800',
      color: '#FFFFFF',
    },

    modalPhotoActions: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    photoActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radius.pill,
    },

    photoActionBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
    },

    removePhotoBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#FEF2F2',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: radius.pill,
    },

    removePhotoBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#EF4444',
    },

    modalLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.heading,
      marginBottom: 6,
    },

    nameInput: {
      backgroundColor: colors.inputBg,
      borderRadius: radius.md,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    bioInput: {
      backgroundColor: colors.inputBg,
      borderRadius: radius.md,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 80,
      textAlignVertical: 'top',
    },

    charCount: {
      fontSize: 11,
      color: colors.muted,
      alignSelf: 'flex-end',
      marginTop: 4,
      marginBottom: 14,
    },

    modalButtons: {
      flexDirection: 'row',
      marginTop: 4,
    },
  });