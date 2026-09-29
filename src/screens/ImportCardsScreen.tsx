import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import JSZip from 'jszip';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { useDecks } from '../context/DeckContext';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ImportCards'>;
type Draft = { id: string; question: string; answer: string };

const MAX_CARDS = 200;

const decodeXml = (s: string) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

// Pull the text of every paragraph out of a Word/PowerPoint XML part.
const paragraphs = (xml: string, para: string, text: string) => {
  const out: string[] = [];
  const paraRe = new RegExp(`<${para}[ >][\\s\\S]*?</${para}>`, 'g');
  const textRe = new RegExp(`<${text}(?: [^>]*)?>([\\s\\S]*?)</${text}>`, 'g');
  for (const p of xml.match(paraRe) ?? []) {
    let line = '';
    let m: RegExpExecArray | null;
    while ((m = textRe.exec(p))) line += decodeXml(m[1]);
    if (line.trim()) out.push(line.trim());
  }
  return out;
};

const readLines = async (uri: string, name: string): Promise<string[]> => {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const res = await fetch(uri);

  if (ext === 'txt' || ext === 'md' || ext === 'csv') {
    return (await res.text()).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  }

  if (ext === 'docx') {
    const zip = await JSZip.loadAsync(await res.arrayBuffer());
    const xml = await zip.file('word/document.xml')?.async('string');
    return xml ? paragraphs(xml, 'w:p', 'w:t') : [];
  }

  if (ext === 'pptx') {
    const zip = await JSZip.loadAsync(await res.arrayBuffer());
    const slides = Object.keys(zip.files)
      .filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))
      .sort((a, b) => parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10));
    const lines: string[] = [];
    for (const f of slides) {
      const xml = await zip.file(f)!.async('string');
      lines.push(...paragraphs(xml, 'a:p', 'a:t'));
    }
    return lines;
  }

  throw new Error(
    ext === 'pdf'
      ? 'PDF text cannot be read on the phone yet. Export it as a Word (.docx) or text (.txt) file and try again.'
      : `.${ext} files are not supported. Use .docx, .pptx or .txt.`,
  );
};

// "Term - Definition", "Term: Definition", tab-separated, or a "?" line followed by its answer.
const toCards = (lines: string[]): Draft[] => {
  const cards: Draft[] = [];
  for (let i = 0; i < lines.length && cards.length < MAX_CARDS; i++) {
    const line = lines[i];
    const split = line.match(/^(.+?)(?:\t|\s[-–—]\s|:\s)(.+)$/);
    if (split) {
      cards.push({ id: `${i}`, question: split[1].trim(), answer: split[2].trim() });
    } else if (line.endsWith('?') && lines[i + 1]) {
      cards.push({ id: `${i}`, question: line, answer: lines[i + 1] });
      i++;
    }
  }
  return cards;
};

export const ImportCardsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deckId } = route.params;
  const { addCard } = useDecks();
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState('');
  const [cards, setCards] = useState<Draft[] | null>(null);

  const pick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setBusy(true);
      setFileName(file.name);
      setCards(toCards(await readLines(file.uri, file.name)));
    } catch (e: any) {
      setCards(null);
      Alert.alert('Could not import', e?.message ?? 'Something went wrong reading that file.');
    } finally {
      setBusy(false);
    }
  };

  const importAll = () => {
    if (!cards || cards.length === 0) return;
    cards.forEach((c) => addCard(deckId, c.question, c.answer));
    Alert.alert('Cards imported', `${cards.length} cards were added to your deck.`, [
      { text: 'OK', onPress: () => navigation.pop(2) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} hitSlop={12}>
        <Ionicons name="chevron-back" size={28} color={colors.heading} />
      </TouchableOpacity>

      {cards === null ? (
        <View style={styles.body}>
          <Text style={styles.title}>Import from File</Text>
          <Text style={styles.subtitle}>Choose a Word, PowerPoint or text file.</Text>
          <TouchableOpacity style={styles.drop} activeOpacity={0.7} onPress={pick} disabled={busy}>
            {busy ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Ionicons name="document-attach-outline" size={40} color={colors.primary} />
                <Text style={styles.dropTitle}>Choose file</Text>
                <Text style={styles.dropMeta}>.docx  ·  .pptx  ·  .txt</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.tip}>
            Write each card on its own line as "Question - Answer" or "Term: Definition". A line
            ending in "?" uses the next line as its answer.
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.previewHead}>
            <Text style={styles.title}>{cards.length} cards found</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{fileName}</Text>
          </View>
          {cards.length === 0 ? (
            <View style={styles.body}>
              <Text style={styles.tip}>
                No question and answer pairs were found. Put each card on its own line as
                "Question - Answer" and try again.
              </Text>
            </View>
          ) : (
            <FlatList
              data={cards}
              keyExtractor={(c) => c.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.q}>{item.question}</Text>
                    <Text style={styles.a}>{item.answer}</Text>
                  </View>
                  <TouchableOpacity
                    hitSlop={10}
                    onPress={() => setCards((prev) => (prev ?? []).filter((c) => c.id !== item.id))}
                  >
                    <Ionicons name="close-circle" size={22} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <View style={styles.footer}>
            {cards.length > 0 && <PrimaryButton title={`Import ${cards.length} cards`} onPress={importAll} />}
            <PrimaryButton
              title="Choose another file"
              variant="secondary"
              onPress={pick}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ImportCardsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  back: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, alignSelf: 'flex-start' },
  body: { padding: spacing.md },
  title: { fontSize: 30, fontWeight: '800', color: colors.heading, marginTop: spacing.md },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 6 },
  drop: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 180,
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  dropTitle: { fontSize: 18, fontWeight: '700', color: colors.heading },
  dropMeta: { fontSize: 14, color: colors.muted },
  tip: { fontSize: 14, color: colors.muted, lineHeight: 20, marginTop: spacing.md },
  previewHead: { paddingHorizontal: spacing.md },
  list: { padding: spacing.md, gap: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
  },
  q: { fontSize: 15, fontWeight: '700', color: colors.heading },
  a: { fontSize: 14, color: colors.muted, marginTop: 2 },
  footer: { padding: spacing.md, paddingBottom: spacing.lg },
});