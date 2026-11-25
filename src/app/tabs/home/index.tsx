// IMPORTS: Mga components ngan tools nga ginagamit ha HomeScreen
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mga reusable components nga ginhimo sa iba nga files
import { BrandHeader } from '../../../components/BrandHeader';    
import { AppButton } from '../../../components/AppButton';
import { StudyCalendar } from '../../../components/StudyCalendar';

// Custom hook para makuha an decks, loading state, ngan error
import { useDecks } from '../../../hooks/useDecks';  
// Colors nga gingagamit sa design san app       
import { palette } from '../../../theme';           

export default function HomeScreen() {
   // Pagkuha san study decks ngan status tikang sa useDecks hook
  const { decks, loading, error } = useDecks();   

   // SafeAreaView: Para diri matabunan an content san status bar
  return <SafeAreaView style={styles.safe} edges={['top']}>     

   // ScrollView: Para puydi mag-scroll an user ha sulod han screen
    <ScrollView                                   
      contentContainerStyle={styles.page} 
       showsVerticalScrollIndicator={false} 
       showsHorizontalScrollIndicator={false}
    >
    // Ini Header san application
    <BrandHeader />

     //  Welcome text ngan introduction san app
    <View style={styles.intro}>
      <Text style={styles.eyebrow}>A MINDFUL LEARNING SPACE</Text>
      <Text style={styles.headline}>A little learning,</Text>
      <Text style={styles.headlineGreen}>a lot of growth.</Text>
      <Text style={styles.description}>Your study space is ready when you are.</Text>
    </View>

    //  Calendar para san study activities
    <StudyCalendar />

    // Text san section
    <View style={styles.sectionHeader}>
      <View style={styles.sectionText}>
       <Text style={styles.sectionTitle}>Your collections</Text>
       <Text style={styles.note}>A few places to begin</Text>
    </View>

    // ADD BUTTON: Pag-click, mapakadto sa Create Deck screen
    <Pressable 
        accessibilityRole="button" 
        accessibilityLabel="Add a deck" 
        onPress={() => router.push('/tabs/decks/create')} 
        style={styles.add}
      >
        <Ionicons 
         name="add" 
         size={21} 
         color={palette.green} 
        />
      </Pressable>

    </View>

    // Checking kon loading, may error, waray decks, o may decks
    {loading ? 
       <Text>Loading decks...</Text> : 

     // Error state: Kon may problema ha pagkuha han decks
     error ? 
        <Text>
           Could not load decks: {error} 
        </Text> :

     // Empty state: Kon waray pa study decks
      decks.length === 0 ? 
        <Text style={styles.empty}>
           No decks yet. Add your first deck.
        </Text> : 

    // Kon waray sini nga conditions, waray message nga ipapakita
         null}

    // DISPLAY DECKS: ini na map() an nagpapakita san tagsa nga deck
    {decks.map(deck => 

    // DECK CARD: Clickable card para ma-open an deck
      <Pressable
       key={deck.id} 
       accessibilityRole="button" 
       accessibilityLabel={`Open ${deck.title}`} 

    // Navigation ngadto sa specific deck gamit an ID
       onPress={() =>  router.push({ 
        pathname: '/tabs/home/deck/[id]', 
        params: { id: deck.id } })} style={styles.card}>

    // CARD TOP: Icon, title, ngan description
      <View style={styles.cardTop}> 
    // Icon san deck
       <View style={styles.icon}>
        <Ionicons 
          name="albums-outline"
           size={20} 
           color={palette.green} 
        />
      
      </View>
    // DECK INFORMATION: Title ngan description
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>
            {deck.title}
          </Text>
     // Kon waray description, Study deck an ipapakita
          <Text style={styles.note}>
            {deck.description || 'Study deck'}
          </Text>
        </View>
            
      </View>

    // CARD BOTTOM: Flashcard count ngan Open deck
      <View style={styles.cardBottom}>

    // Pagpakita han kadamu han flashcards
        <Text style={styles.note}>
          {deck.itemCount}
           {deck.itemCount === 1 ? 'flashcard' : 'flashcards'}
        </Text>

    // Open deck label ngan arrow icon
        <View style={styles.open}>
          <Text style={styles.openText}>
            Open deck
          </Text>

        <Ionicons
          name="arrow-forward"
          size={17} 
          color={palette.green} 
        />
      </View>

      </View>
    
    </Pressable>)}
    
    // CONTINUE STUDYING BUTTON:
        // Navigation ngadto ha Decks screen
      <AppButton 
       title="Continue studying"
       onPress={() => router.navigate('/tabs/decks')} 
       style={styles.continue} 
      />

    </ScrollView>

  </SafeAreaView>;
}
  // STYLES: Design, spacing, colors, sizes ngan layout han HomeScreen
const styles = StyleSheet.create({
  
  // MAIN SCREEN: Background ngan full screen layout
  safe: {
     flex: 1,
      backgroundColor: palette.background }, 

  // PAGE: Padding ha sides, top, ngan bottom
  page: { 
    paddingHorizontal: 22,
    paddingTop: 8, 
    paddingBottom: 126 }, 

  // INTRO SECTION: Space san welcome section
  intro: { 
    marginBottom: 14 }, 
 
  // EYEBROW: Small text sa igbaw han headline
    eyebrow: { 
      color: palette.muted, 
      fontSize: 9, 
      fontWeight: '700',
      letterSpacing: 1.5,
       marginBottom: 12 },

  // MAIN HEADLINE: Styling san primary headline
    headline: { 
      color: '#294638',
      fontSize: 29, 
      lineHeight: 35, fontWeight: '700', 
      letterSpacing: -0.8 }, 
  // GREEN HEADLINE: Styling han second headline
    headlineGreen:  {
       color: '#315D48',
        fontSize: 29,
        lineHeight: 35, 
        fontWeight: '700',
        letterSpacing: -0.8 }, 
  // DESCRIPTION: Styling han small description
    description: { 
      color: palette.muted, 
      marginTop: 8, 
      fontSize: 12 },
  // SECTION HEADER: Horizontal layout han section title ngan add button
    sectionHeader: {
       flexDirection: 'row', 
       alignItems: 'center',
        marginBottom: 15 },
  // SECTION TEXT: Container han section title
    sectionText: { 
      flex: 1 },
      
    sectionTitle: { color: '#294638', fontSize: 18, fontWeight: '700' }, note: { color: palette.muted, fontSize: 11, marginTop: 4 }, add: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }, empty: { color: palette.muted, marginBottom: 16 }, card: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 20, padding: 15, marginBottom: 12 }, cardTop: { flexDirection: 'row', alignItems: 'center' }, icon: { width: 42, height: 42, borderRadius: 13, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, cardText: { flex: 1 }, cardTitle: { color: '#294638', fontSize: 16, fontWeight: '700' }, cardBottom: { borderTopWidth: 1, borderTopColor: palette.line, marginTop: 14, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, open: { flexDirection: 'row', alignItems: 'center', gap: 10 }, openText: { color: palette.green, fontSize: 11, fontWeight: '700' }, continue: { marginTop: 10 } });
