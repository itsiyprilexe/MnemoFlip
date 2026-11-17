import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, type User } from 'firebase/auth';
import { collection, doc, getDocsFromServer, writeBatch, type DocumentReference } from 'firebase/firestore';
import { db } from './firebase';

// Reauthentication happens before any data is removed. If cleanup fails, the
// account stays signed in so the user can retry the remaining deletions.
export async function deleteAccount(user: User, password: string) {
  if (!user.email || !user.providerData.some(provider => provider.providerId === 'password')) {
    throw new Error('Account deletion currently supports email and password accounts only.');
  }
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
  const uid = user.uid;
  const deleteRefs = async (refs: DocumentReference[]) => {
    for (let i = 0; i < refs.length; i += 400) {
      const batch = writeBatch(db);
      refs.slice(i, i + 400).forEach(ref => batch.delete(ref));
      await batch.commit();
    }
  };
  for (const [name, nested] of [['decks', 'cards'], ['quizzes', 'questions']] as const) {
    const parents = await getDocsFromServer(collection(db, 'users', uid, name));
    for (const parent of parents.docs) {
      const children = await getDocsFromServer(collection(parent.ref, nested));
      await deleteRefs(children.docs.map(child => child.ref));
      await deleteRefs([parent.ref]);
    }
  }
  const results = await getDocsFromServer(collection(db, 'users', uid, 'quizResults'));
  await deleteRefs(results.docs.map(result => result.ref));
  await deleteRefs([doc(db, 'users', uid)]);
  await deleteUser(user);
}
