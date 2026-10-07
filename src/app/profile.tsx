import React from 'react'; //gi i-import an "React", which is is gin gagamit san interface san screen.
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'; //Imports items from React Native
import { router } from 'expo-router'; //gi i-import an navigation tool san Expo Router’s. Sa "Profile screen" naman, gin gagmit an "router.replace('/')" para kumadto sa "welcome screen" when they tap Log out.
import { Ionicons } from '@expo/vector-icons'; //Imports the Ionicons component, used to show icons such as the deck and quiz symbols.
import { SafeAreaView } from 'react-native-safe-area-context'; //Imports a container that keeps screen content within the device’s safe area, away from areas such as the status bar or screen edges.
import { AppButton } from '../components/AppButton'; //brings the shared folder to the app kay gigagamit siya sa mga button pareho san "log out" button and "Account settings" button.
import { BrandHeader } from '../components/BrandHeader'; // brings the shared folder to the app para pareho pareho design sa header kada screen. 
import { collections, quizzes } from '../data/study'; // brings the mga sample data san deck ngan ngan quiz. Gin gagamit siya para maihap an mga sample deck ngan quiz.
import { palette } from '../theme'; //brings the color na gigagmit sa bug-os na app, pareho sa "palette.green" ngan "palette.surface" para magtugma an color san buttons, card, ngan texts sa iba iba nga screen.

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <BrandHeader />

        {/*gi didisplay an small label na "YOUR SPACE". 
        "styles.eyebrow" controls its appearance, such as its color and size.*/}
        <Text style={styles.eyebrow}>YOUR SPACE</Text> 

        {/*gi didisplay an "Profile" as the screen’s main heading. 
        "styles.title" controls sa iya apperance.*/}
        <Text style={styles.title}>Profile</Text>

        {/* gi didisplay an user's profile information. "styles.profileCard" controls its appearance.*/}
        <View style={styles.profileCard}>

          {/*naghihimo san avatar containing san letter "Y". "styles.avatar" 
          styles the container, while an "styles.avatarLetter" styles the letter "Y".*/}
          <View style={styles.avatar}>
            <Text 
              style={styles.avatarLetter}>Y</Text>
          </View>

          {/* gi display an user's name. "styles.name" controls its appearance.*/}
          <Text style={styles.name}>Harry Potter</Text>

          {/* gi display and user's subtitle. "styles.subtitle" controls its appearance.*/}
          <Text style={styles.subtitle}>Computer Science Student</Text>
        </View>

        {/*Displays the section title for the learning space. "styles.sectionTitle" controls its appearance.*/}
        <Text style={styles.sectionTitle}>Your learning space</Text>

        {/*naghihimo card para ma hold sa study deck ngan quiz counts*/}
        <View style={styles.statsCard}>

          {/*naghihimo row para sa study deck information ngan another row for quizzes.*/}
          <View style={styles.statRow}>

            {/*gi didisplays an deck or album icon. "name" selects the icon, "size" sets its size, 
            and "color" sets its color. Here, the color comes from the shared palette.*/}
            <View style={styles.statIcon}>
              <Ionicons 
                name="albums-outline" 
                size={18} 
                color={palette.green} 
              />
            </View>

            {/* gi display an label san "Study decks". 
            "styles.statLabel" controls its appearance.*/}
            <Text style={styles.statLabel}>Study decks</Text>

            {/* gi didisplays an value para sa "Study decks". 
            "styles.statValue" controls its appearance.*/}
            <Text style={styles.statValue}>{collections.length}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>

            {/* gi display a help icon. "name" selects the icon, "size" sets its size, 
            and "color" sets its color. Here, the color comes from the shared palette.*/}
            <View style={styles.statIcon}>
              <Ionicons 
                name="help-circle-outline" 
                size={18} 
                color="#786798" 
              />
            </View>

            {/* gi display an label san "Quizzes". 
            "styles.statLabel" controls its appearance.*/}
            <Text style={styles.statLabel}>Quizzes</Text>

            {/* gi didisplays an value para sa "Quizzes". 
            "styles.statValue" controls its appearance.*/}
            <Text style={styles.statValue}>{quizzes.length}</Text>
          </View>
        </View>
        
        
        {/* placeholder pala ini siya kay dire pa working that's why pag pinduton mo 
        may magawas na allert message which is the “Profile settings are coming soon.” */}
        <AppButton 
          title="Account settings" 
          onPress={() => Alert.alert('Under construction', 'Profile settings are coming soon.')} 
          style={styles.button} 
        />

        {/*kapag pinduton ini gi babalik siya sa welcome screen kun diin makikita an "Log in" ngan "Sign up"*/}
        <AppButton
          title="Log out"
          onPress={() => router.replace('/')}
          style={styles.logoutButton}
        />

        {/*Displays a note about the sample profile. "styles.note" controls its appearance.*/}
        <Text style={styles.note}>This is a sample profile. No personal data is saved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

//
const styles = StyleSheet.create({

//Screen layout
  safeArea: { 
    flex: 1, //makes the screen fill the available space.
    backgroundColor: palette.background //sets the screen background using the app’s shared theme color.
  },

  //Adds space around the screen content:
  page: { 
    paddingHorizontal: 22, //adds space on the left and right.
    paddingTop: 8, //adds space above.
    paddingBottom: 126 //leaves extra room at the bottom, likely so content doesn’t sit behind the floating tab bar.
  },

  //Styles a small heading such as "YOUR SPACE"
  eyebrow: { 
    fontSize: 10, //Sets the font size.
    color: palette.muted, //Sets the muted text color.
    letterSpacing: 1.5, //Spreads the letters apart
    fontWeight: '700', //Makes the text bold with
    marginBottom: 10 //Adds space below it with
  },

  //Styles the "Profile"
  title: { 
    fontSize: 29, //sets the character size.
    lineHeight: 35, //sets the height of each text line.
    fontWeight: '700', //brings the letters slightly closer together.
    letterSpacing: -1, //brings the letters slightly closer together.
    color: palette.ink,
    marginBottom: 20 //adds space below the title.
  },

  //Styles the card containing the avatar, name, and profile details
  profileCard: { 
    backgroundColor: palette.surface, //Sets its background, border, and rounded corners.
    alignItems: 'center', //centers its children horizontally.
    borderRadius: 22, 
    padding: 22, //adds space inside the card.
    borderWidth: 1, 
    borderColor: palette.line, 
    marginBottom: 26 //adds space beneath the card.
  },

  //Styles the circular avatar
  avatar: { 
    width: 74, //make it a 74-by-74 square.
    height: 74, //make it a 74-by-74 square.
    borderRadius: 37, //rounds it into a circle.
    backgroundColor: palette.greenLight, //sets the background color.
    alignItems: 'center', //centers the letter inside
    justifyContent: 'center', //centers the letter inside
    marginBottom: 12 //adds space below the avatar.
  },

  //Styles the letter shown in the avatar
  avatarLetter: { 
    color: palette.green, //sets the letter color green
    fontSize: 26, //sets the size
    fontWeight: '700' //sets as bold
  },

  //Styles the letter shown in the avatar
  name: { 
    color: palette.ink, //sets the color
    fontSize: 18, //sets the size
    fontWeight: '700' //ses as bold
  },

  //Styles the profile name
  subtitle: { 
    color: palette.green, //sets the color into green
    fontSize: 11, //sets the size
    fontWeight: '700', //set as bold
    marginTop: 5 //adds a small gap above it
  },

  //Learning-space heading and statistics card
  sectionTitle: { 
    color: palette.ink, //sets the color
    fontSize: 17, //sets the size
    fontWeight: '700', //set as bold
    marginBottom: 12 //add space below it before the card
  },

  //Styles the card that contains the "deck" and "quiz" counts
  statsCard: { 
    backgroundColor: palette.surface, //sets the background color.
    borderRadius: 18, 
    borderWidth: 1, 
    borderColor: palette.line, //sets the boder color.
    paddingHorizontal: 15, //adds left and right inner spacing.
    marginBottom: 20 //leaves space below the card.
  },

  //Rows and icons inside the statistics card
  statRow: { 
    minHeight: 57, //Ensures the row is at least 57 points tall.
    flexDirection: 'row', //Places its children horizontally because
    alignItems: 'center' //Vertically centers them.
  },

  //Styles the small box behind each statistics icon
  statIcon: { 
    width: 33, //sets the width
    height: 33, //sets the height
    borderRadius: 11, //Sets its size, rounded corners, and background.
    backgroundColor: palette.greenLight, //sets the background color
    alignItems: 'center', //enters the icon inside it.
    justifyContent: 'center', //Adds space to its right before the label.
    marginRight: 11 //
  },

  //Styles labels such as Study decks and Quizzes.
  statLabel: { 
    flex: 1, //makes the label take up available row space
    color: palette.ink, //sets the color
    fontSize: 12, //sets the size
    fontWeight: '600'//sets as bold
   },

   //Styles the count at the right of each row
  statValue: { 
    color: palette.green, //sets the color
    fontSize: 13, //sets the size
    fontWeight: '700' //sets as bold
  },

  //Creates a thin horizontal separator between the deck and quiz rows
  divider: { 
    height: StyleSheet.hairlineWidth, //uses a very thin line appropriate for the device
    backgroundColor: palette.line //sets the background color
  },

  //Buttons
  button: { 
    marginBottom: 15 //
  },

  
  logoutButton: { 
    backgroundColor: '#A64E46', //sets the color
    marginBottom: 15 //Adds space below the regular Profile button.
  },
  
  //notes
  note: { 
    color: palette.muted, ////Sets the muted text color.
    textAlign: 'center', //centered on the screen.
    fontSize: 10 //sets the size
  },
});
