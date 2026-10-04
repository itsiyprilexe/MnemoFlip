/**
 * StorageContext
 * Provides static, pre-populated flashcard decks, quizzes, and high scores.
 * Replaces dynamic AsyncStorage database CRUD with static mock data.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────


/// Represents a single flashcard with a unique ID, question, and answer.
export interface Flashcard {// Represents a single flashcard with a unique ID, question, and answer.
  id: string;// Unique identifier for the flashcard, used for referencing and managing individual cards.
  question: string;// The question or prompt displayed on the front of the flashcard, used for testing knowledge or recall.
  answer: string;// The answer or explanation displayed on the back of the flashcard, providing the correct response to the question.
}



// Represents a deck of flashcards, containing a unique ID, title, description, and an array of flashcards.
export interface Deck {// Represents a deck of flashcards, containing a unique ID, title, description, and an array of flashcards.
  id: string;// Unique identifier for the deck, used for referencing and managing individual decks.
  title: string;// The title of the deck, providing a brief and descriptive name for the collection of flashcards.
  description: string;// A short description of the deck, offering additional context or information about the content and purpose of the flashcards.
  cards: Flashcard[];// An array of flashcards contained within the deck, representing the individual questions and answers that make up the learning material.
}


// Represents a single quiz question, including a unique ID, the question text, multiple answer options, and the index of the correct answer.
export interface QuizQuestion {// Represents a single quiz question, including a unique ID, the question text, multiple answer options, and the index of the correct answer.
  id: string;// Unique identifier for the quiz question, used for referencing and managing individual questions.
  question: string;// The text of the quiz question, presented to the user for answering.
  options: string[];// An array of possible answer options for the quiz question, allowing the user to select from multiple choices.
  correctIndex: number;// The index of the correct answer within the options array, indicating which option is the right answer for the question.
}




// Represents a quiz, containing a unique ID, title, description, and an array of quiz questions.
export interface Quiz {// Represents a quiz, containing a unique ID, title, description, and an array of quiz questions.
  id: string;// Unique identifier for the quiz, used for referencing and managing individual quizzes.
  title: string;// The title of the quiz, providing a brief and descriptive name for the collection of questions.
  description: string;// A short description of the quiz, offering additional context or information about the content and purpose of the questions.
  questions: QuizQuestion[];// An array of quiz questions contained within the quiz, representing the individual prompts and answer choices that make up the assessment.
}







// Represents a high score achieved in a quiz or deck, including the associated deck ID, title, score, total questions, and the date the score was recorded.
export interface HighScore {// Represents a high score achieved in a quiz or deck, including the associated deck ID, title, score, total questions, and the date the score was recorded.
  deckId: string;// The unique identifier of the deck or quiz for which the high score was achieved, linking the score to its corresponding content.
  deckTitle: string;// The title of the deck or quiz for which the high score was achieved, providing a human-readable reference to the content.
  score: number;// The numerical score achieved by the user, representing the number of correct answers or points earned during the quiz or deck completion.
  totalQuestions: number;// The total number of questions or prompts in the quiz or deck, used to calculate the user's performance and percentage score.
  date: string;// The date on which the high score was recorded, providing a timestamp for when the achievement occurred.
}







// ─── Static Mock Data of Decks and Quizzes ───────────────────────────────────────────────────────



/// Pre-populated static flashcard decks with questions and answers for various subjects.
export const STATIC_DECKS: Deck[] = [// Pre-populated static flashcard decks with questions and answers for various subjects.
  
  
  {// Represents a single flashcard deck, including its unique ID, title, description, and an array of flashcards.

  //----------------------------------Computer Science Fundamentals//----------------------------------//----------------------------------//----------------------------------

    id: 'deck-cs',// Unique identifier for the Computer Science Fundamentals deck.
    title: 'Computer Science Fundamentals',// Title of the deck, indicating its focus on core concepts of computer science.
    description: 'Core concepts of data structures, algorithms, and computing.',// Short description of the deck, providing context about the content and purpose of the flashcards.
    cards: [      // Array of flashcards contained within the deck, representing individual questions and answers related to computer science fundamentals.
      {
        id: 'c-cs-1',// Unique identifier for the first flashcard in the Computer Science Fundamentals deck.
        question: 'What is the key difference between a Stack and a Queue?',// The question posed on the flashcard, testing knowledge of data structures.
        answer:// The answer provided on the flashcard, explaining the distinction between the two data structures.
          'A Stack operates on Last-In-First-Out (LIFO), whereas a Queue operates on First-In-First-Out (FIFO).',
      },
      {
        id: 'c-cs-2',
        question: 'What is the time complexity of binary search on a sorted array?',
        answer:
          'O(log n), because the search space is divided in half with every comparison.',
      },
      {
        id: 'c-cs-3',
        question: 'What does the ACID acronym represent in databases?',
        answer:
          'Atomicity, Consistency, Isolation, and Durability — guaranteeing reliable database transactions.',
      },
      {
        id: 'c-cs-4',
        question: 'What is the role of an Operating System Kernel?',
        answer:
          'The core software that manages hardware resources (CPU, RAM, devices) and mediates system calls for applications.',
      },
      {
        id: 'c-cs-5',
        question: 'What is the difference between synchronous and asynchronous operations?',
        answer:
          'Synchronous code blocks further execution until complete; asynchronous code executes in the background without blocking.',
      },
      {
        id: 'c-cs-6',
        question: 'What is recursion in computer programming?',
        answer:
          'A programming method where a function calls itself to solve smaller instances of the problem until a base condition is met.',
      },
    ],
  },// End of the Computer Science Fundamentals deck object.








  //----------------------------------General Biology & Life Science//----------------------------------//----------------------------------//----------------------------------
  {
    id: 'deck-bio',// Unique identifier for the General Biology & Life Science deck.
    title: 'General Biology & Life Science',// Title of the deck, indicating its focus on key concepts in biology and life sciences.
    description: 'Key concepts in cellular biology, genetics, and physiology.',// Short description of the deck, providing context about the content and purpose of the flashcards.
    cards: [        // Array of flashcards contained within the deck, representing individual questions and answers related to biology and life sciences.
      {
        id: 'c-bio-1',
        question: 'Which organelle is considered the powerhouse of the cell?',
        answer:
          'Mitochondria — produces ATP (adenosine triphosphate) through cellular respiration.',
      },
      {
        id: 'c-bio-2',
        question: 'What is the fundamental chemical reaction of photosynthesis?',
        answer:
          '6CO₂ + 6H₂O + solar energy → C₆H₁₂O₆ (glucose) + 6O₂.',
      },
      {
        id: 'c-bio-3',
        question: 'Which four nitrogenous bases make up DNA?',
        answer:
          'Adenine (A), Thymine (T), Guanine (G), and Cytosine (C).',
      },
      {
        id: 'c-bio-4',
        question: 'What is the primary function of Red Blood Cells (erythrocytes)?',
        answer:
          'Carrying oxygen from the lungs to body tissues using the iron-containing protein hemoglobin.',
      },
      {
        id: 'c-bio-5',
        question: 'What is osmosis?',
        answer:
          'The passive net movement of water molecules across a semipermeable membrane from low to high solute concentration.',
      },
    ],
  },// End of the General Biology & Life Science deck object.





  {//----------------------------------World History & Civilizations//----------------------------------//----------------------------------//----------------------------------
    id: 'deck-hist',// Unique identifier for the World History & Civilizations deck.
    title: 'World History & Civilizations',// Title of the deck, indicating its focus on historical events and civilizations.
    description: 'Milestones, cultural eras, and major global events.',// Short description of the deck, providing context about the content and purpose of the flashcards.
    cards: [// Array of flashcards contained within the deck, representing individual questions and answers related to world history and civilizations.
      {
        id: 'c-hist-1',// Unique identifier for the first flashcard in the World History & Civilizations deck.
        question: 'In what year did World War II officially end?',// The question posed on the flashcard, testing knowledge of historical events.
        answer:// The answer provided on the flashcard, explaining the conclusion of World War II.
          '1945, marked by the unconditional surrender of the Axis powers.',
      },
      {
        id: 'c-hist-2',
        question: 'Which ancient civilization built the Great Pyramids of Giza?',
        answer:
          'Ancient Egypt during the Old Kingdom period (~2500 BCE).',
      },
      {
        id: 'c-hist-3',
        question: 'What was the Renaissance and where did it originate?',
        answer:
          'A cultural revival of art, literature, and science originating in 14th-century Florence, Italy.',
      },
      {
        id: 'c-hist-4',
        question: 'What historic English charter was signed in 1215 to limit royal authority?',
        answer:
          'The Magna Carta (Great Charter) granted by King John of England.',
      },
      {
        id: 'c-hist-5',
        question: 'Who introduced the movable-type printing press to Europe?',
        answer:
          'Johannes Gutenberg in Mainz, Germany, circa 1440.',
      },
    ],
  },// End of the World History & Civilizations deck object.







  {//----------------------------------Spanish Language Essentials//----------------------------------//----------------------------------//----------------------------------
    id: 'deck-span',// Unique identifier for the Spanish Language Essentials deck.
    title: 'Spanish Language Essentials',// Title of the deck, indicating its focus on essential Spanish vocabulary and expressions.
    description: 'Essential vocabulary, greetings, and common expressions.',// Short description of the deck, providing context about the content and purpose of the flashcards.
    cards: [// Array of flashcards contained within the deck, representing individual questions and answers related to Spanish language essentials.
      {
        id: 'c-span-1',// Unique identifier for the first flashcard in the Spanish Language Essentials deck.
        question: 'How do you say "Good morning" and "Good night" in Spanish?',// The question posed on the flashcard, testing knowledge of basic Spanish greetings.
        answer:// The answer provided on the flashcard, explaining how to greet someone in Spanish during different times of the day.
          '"Buenos días" (Good morning) and "Buenas noches" (Good night / evening).',
      },
      {
        id: 'c-span-2',
        question: 'What is the distinction between verbs "ser" and "estar"?',
        answer:
          '"Ser" is used for permanent traits and identity; "estar" is used for temporary conditions and locations.',
      },
      {
        id: 'c-span-3',
        question: 'How do you ask "Where is the library?" in Spanish?',
        answer:
          '"¿Dónde está la biblioteca?"',
      },
      {
        id: 'c-span-4',
        question: 'What do "Por favor" and "Muchas gracias" mean?',
        answer:
          '"Please" and "Thank you very much".',
      },
      {
        id: 'c-span-5',
        question: 'Translate: "Tengo que estudiar para el examen de mañana."',
        answer:
          '"I have to study for tomorrow\'s exam."',
      },
    ],
  },






  //----------------------------------Visual Art & Design Principles//----------------------------------//----------------------------------//----------------------------------
  {
    id: 'deck-art',// Unique identifier for the Visual Art & Design Principles deck.
    title: 'Visual Art & Design Principles',// Title of the deck, indicating its focus on fundamental concepts in visual art and design.
    description: 'Elements of composition, color harmony, and visual aesthetics.',// Short description of the deck, providing context about the content and purpose of the flashcards.
    cards: [// Array of flashcards contained within the deck, representing individual questions and answers related to visual art and design principles.
      {
        id: 'c-art-1',// Unique identifier for the first flashcard in the Visual Art & Design Principles deck.
        question: 'What are the primary colors in pigment (subtractive) color theory?',// The question posed on the flashcard, testing knowledge of color theory in visual arts.
        answer:// The answer provided on the flashcard, explaining the primary colors used in pigment-based color mixing.
          'Red, Yellow, and Blue (or Cyan, Magenta, Yellow in modern printing).',
      },
      {
        id: 'c-art-2',
        question: 'What distinguishes serif from sans-serif fonts?',
        answer:
          'Serif fonts have small decorative strokes ("feet") at the ends of letterforms; sans-serif fonts are clean and stroke-less.',
      },
      {
        id: 'c-art-3',
        question: 'What is the Rule of Thirds in composition?',
        answer:
          'Dividing an image with 2 horizontal and 2 vertical lines to position focal points along lines or intersections.',
      },
      {
        id: 'c-art-4',
        question: 'What does the term "chiaroscuro" describe in art?',
        answer:
          'The deliberate contrast between strong light and deep shadow to give subjects volume and dramatic depth.',
      },
    ],
  },// End of the Visual Art & Design Principles deck object.



];// End of the STATIC_DECKS array containing all pre-populated flashcard decks.-----------------------------------------------------------------------------///////////////////------------------





// Represents a collection of pre-populated quizzes with questions and answer options for various subjects.
export const STATIC_QUIZZES: Quiz[] = [ // Represents a collection of pre-populated quizzes with questions and answer options for various subjects.
  {// Represents a single quiz, including its unique ID, title, description, and an array of quiz questions.




  //----------------------------------Computer Science Quick Check//----------------------------------//----------------------------------//----------------------------------
    id: 'quiz-cs',// Unique identifier for the Computer Science Quick Check quiz.
    title: 'Computer Science Quick Check',// Title of the quiz, indicating its focus on assessing knowledge of computer science fundamentals.
    description: 'Test your understanding of basic algorithms, data structures, and computing.',// Short description of the quiz, providing context about the content and purpose of the questions.
    questions: [// Array of quiz questions contained within the quiz, representing individual prompts and answer choices related to computer science fundamentals.
      {
        id: 'q-cs-1',// Unique identifier for the first quiz question in the Computer Science Quick Check quiz.
        question: 'What is the average time complexity of accessing an array element by index?',// The question posed in the quiz, testing knowledge of algorithmic time complexity.
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],// An array of possible answer options for the quiz question, allowing the user to select from multiple choices.
        correctIndex: 0,// The index of the correct answer within the options array, indicating which option is the right answer for the question.
      },// End of the first quiz question object.
      {
        id: 'q-cs-2',
        question: 'Which data structure follows a First-In-First-Out (FIFO) pattern?',
        options: ['Stack', 'Queue', 'Binary Search Tree', 'Max-Heap'],
        correctIndex: 1,
      },
      {
        id: 'q-cs-3',
        question: 'What does HTTP stand for in networking?',
        options: [
          'HyperText Transfer Protocol',
          'High Tech Terminal Process',
          'Host Transfer Protocol',
          'Hybrid Text Transport Packet',
        ],
        correctIndex: 0,
      },
      {
        id: 'q-cs-4',
        question: 'Which type of computer memory retains data even when power is turned off?',
        options: ['RAM', 'L2 Cache', 'SSD / ROM', 'CPU Registers'],
        correctIndex: 2,
      },
      {
        id: 'q-cs-5',
        question: 'In OOP, combining data attributes and operating methods within a single class is called:',
        options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
        correctIndex: 2,
      },
    ],
  },// End of the Computer Science Quick Check quiz object.














  //----------------------------------General Science Challenge//----------------------------------//----------------------------------//----------------------------------
  {// Represents a single quiz, including its unique ID, title, description, and an array of quiz questions.
    id: 'quiz-sci',// Unique identifier for the General Science Challenge quiz.
    title: 'General Science Challenge',// Title of the quiz, indicating its focus on testing knowledge across various scientific disciplines.
    description: 'Multiple-choice questions spanning life science, chemistry, and physics.',// Short description of the quiz, providing context about the content and purpose of the questions.
    questions: [// Array of quiz questions contained within the quiz, representing individual prompts and answer choices related to general science topics.
      {
        id: 'q-sci-1',// Unique identifier for the first quiz question in the General Science Challenge quiz.
        question: 'Which cell organelle generates ATP energy through cellular respiration?',//
        options: ['Ribosome', 'Mitochondria', 'Golgi Body', 'Endoplasmic Reticulum'],// 
        correctIndex: 1,// The index of the correct answer within the options array, indicating which option is the right answer for the question.
      },// End of the first quiz question object.
      {
        id: 'q-sci-2',
        question: 'What is the chemical formula for pure water?',
        options: ['CO₂', 'NaCl', 'H₂O', 'CH₄'],
        correctIndex: 2,
      },
      {
        id: 'q-sci-3',
        question: 'Which planet in our solar system orbits closest to the Sun?',
        options: ['Venus', 'Mars', 'Mercury', 'Earth'],
        correctIndex: 2,
      },
      {
        id: 'q-sci-4',
        question: 'What fundamental force draws objects toward the center of the Earth?',
        options: ['Centrifugal force', 'Gravity', 'Magnetic pull', 'Static friction'],
        correctIndex: 1,
      },
      {
        id: 'q-sci-5',
        question: 'Which gas do green plants absorb from the air during photosynthesis?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Methane'],
        correctIndex: 1,
      },
    ],
  },// End of the General Science Challenge quiz object.




















  {//----------------------------------World History Quiz//----------------------------------//----------------------------------//----------------------------------
    id: 'quiz-hist',// Unique identifier for the World History Quiz.
    title: 'World History Quiz',// Title of the quiz, indicating its focus on testing knowledge of historical events and civilizations.
    description: 'Explore key historical eras, ancient civilizations, and major milestones.',// Short description of the quiz, providing context about the content and purpose of the questions.
    questions: [// Array of quiz questions contained within the quiz, representing individual prompts and answer choices related to world history.
      {
        id: 'q-hist-1',// Unique identifier for the first quiz question in the World History Quiz.
        question: 'In which year did World War II conclude?',// The question posed in the quiz, testing knowledge of historical events.
        options: ['1939', '1941', '1945', '1950'],// An array of possible answer options for the quiz question, allowing the user to select from multiple choices.
        correctIndex: 2,// The index of the correct answer within the options array, indicating which option is the right answer for the question.
      },// End of the first quiz question object.
      {
        id: 'q-hist-2',
        question: 'Which pre-Columbian civilization constructed the citadel of Machu Picchu?',
        options: ['Aztec', 'Maya', 'Inca', 'Olmec'],
        correctIndex: 2,
      },
      {
        id: 'q-hist-3',
        question: 'Who was the first President of the United States under the Constitution?',
        options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Alexander Hamilton'],
        correctIndex: 1,
      },
      {
        id: 'q-hist-4',
        question: 'In which European country did the Renaissance movement first begin?',
        options: ['France', 'England', 'Italy', 'Germany'],
        correctIndex: 2,
      },
      {
        id: 'q-hist-5',
        question: 'Which ancient Roman military commander was declared dictator perpetuo in 44 BCE?',
        options: ['Julius Caesar', 'Alexander the Great', 'Hannibal', 'Augustus'],
        correctIndex: 0,
      },
    ],
  },// End of the World History Quiz object.











  {//----------------------------------Basic Spanish Vocabulary Quiz//----------------------------------//----------------------------------//----------------------------------
    id: 'quiz-span',// Unique identifier for the Basic Spanish Vocabulary Quiz.
    title: 'Basic Spanish Vocabulary',// Title of the quiz, indicating its focus on testing knowledge of essential Spanish vocabulary and expressions.
    description: 'Review common vocabulary words, greetings, and expressions.',// Short description of the quiz, providing context about the content and purpose of the questions.
    questions: [// Array of quiz questions contained within the quiz, representing individual prompts and answer choices related to basic Spanish vocabulary.
     
      {// Unique identifier for the first quiz question in the Basic Spanish Vocabulary Quiz.
        id: 'q-span-1',
        question: 'What does the Spanish word "Gracias" mean?',// The question posed in the quiz, testing knowledge of basic Spanish vocabulary.
        options: ['Please', 'Thank you', "You're welcome", 'Goodbye'],// An array of possible answer options for the quiz question, allowing the user to select from multiple choices.
        correctIndex: 1,// The index of the correct answer within the options array, indicating which option is the right answer for the question.
      },// End of the first quiz question object.
      {
        id: 'q-span-2',
        question: 'How do you greet someone with "Good morning" in Spanish?',
        options: ['Buenas tardes', 'Buenas noches', 'Buenos días', 'Hasta pronto'],
        correctIndex: 2,
      },
      {
        id: 'q-span-3',
        question: 'What does the Spanish word "libro" translate to in English?',
        options: ['Letter', 'Book', 'Pen', 'Library'],
        correctIndex: 1,
      },
      {
        id: 'q-span-4',
        question: 'Which color is represented by "azul"?',
        options: ['Red', 'Green', 'Yellow', 'Blue'],
        correctIndex: 3,
      },
      {
        id: 'q-span-5',
        question: 'What is the Spanish term for "water"?',
        options: ['Agua', 'Fuego', 'Tierra', 'Viento'],
        correctIndex: 0,
      },
    ],
  },// End of the Basic Spanish Vocabulary Quiz object.




];// End of the STATIC_QUIZZES array containing all pre-populated quizzes.-----------------------------------------------------------------------------///////////////////------------------












/// Represents a collection of pre-populated high scores achieved in quizzes or decks.
export const STATIC_HIGH_SCORES: HighScore[] = [// Represents a collection of pre-populated high scores achieved in quizzes or decks.

  {// Represents a single high score entry, including the associated deck ID, title, score, total questions, and the date the score was recorded.
    deckId: 'quiz-cs',// Unique identifier of the deck or quiz for which the high score was achieved.
    deckTitle: 'Computer Science Quick Check',// Title of the deck or quiz for which the high score was achieved, providing a human-readable reference to the content.
    score: 5,// The numerical score achieved by the user, representing the number of correct answers or points earned during the quiz or deck completion.
    totalQuestions: 5,// The total number of questions or prompts in the quiz or deck, used to calculate the user's performance and percentage score.
    date: 'Yesterday',// The date on which the high score was recorded, providing a timestamp for when the achievement occurred.
  },// End of the first high score entry object.
  
  
  
  
  {// Represents a single high score entry, including the associated deck ID, title, score, total questions, and the date the score was recorded.
    deckId: 'quiz-sci',
    deckTitle: 'General Science Challenge',
    score: 4,
    totalQuestions: 5,
    date: '3 days ago',
  },
  {
    deckId: 'quiz-hist',
    deckTitle: 'World History Quiz',
    score: 5,
    totalQuestions: 5,
    date: 'Oct 2, 2026',
  },
  {
    deckId: 'quiz-span',
    deckTitle: 'Basic Spanish Vocabulary',
    score: 4,
    totalQuestions: 5,
    date: 'Oct 1, 2026',
  },
];// End of the STATIC_HIGH_SCORES array containing all pre-populated high scores.-----------------------------------------------------------------------------///////////////////------------------







// ─── Helpers ─────────────────────────────────────────────────────────────────
// Generates a unique identifier by combining the current timestamp in base-36 with a random string segment.
const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;// Returns a string that serves as a unique ID, useful for identifying decks, cards, quizzes, and questions within the application.














// ─── Context Shape ────────────────────────────────────────────────────────────
// Defines the shape of the StorageContext, specifying the types and functions available for managing decks, quizzes, and high scores.
interface StorageContextType {


  // Decks
  decks: Deck[];// An array of flashcard decks available in the application, each containing a 
                  //unique ID, title, description, and an array of flashcards.
  createDeck: (title: string, description: string) => string;// Function to create a new deck, taking a title and description as 
                                                                //parameters, and returning the unique ID of the newly created deck.

  renameDeck: (id: string, title: string, description: string) => void;// Function to rename an existing deck, taking the deck's unique ID, new title, 
                                                                            //and new description as parameters, and updating the corresponding deck in the state.

  deleteDeck: (id: string) => void;// Function to delete an existing deck, taking the deck's unique ID as a parameter, 
                                        //and removing the corresponding deck from the state.
  addCard: (deckId: string, question: string, answer: string) => void;// Function to add a new flashcard to a specific deck,
                                                                        // taking the deck's unique ID, question text, and answer text as parameters, and appending the new card to the deck's cards array.
  deleteCard: (deckId: string, cardId: string) => void;// Function to delete a flashcard from a specific deck,
                                                        // taking the deck's unique ID and the card's unique ID as parameters, and removing the corresponding card from the deck's cards array.




  // Quizzes
  quizzes: Quiz[];// An array of quizzes available in the application, each containing a unique ID, 
                   //title, description, and an array of quiz questions.
  createQuiz: (title: string, description: string) => string;// Function to create a new quiz, taking a title and description as parameters, and returning the unique ID of the newly created quiz.
  renameQuiz: (id: string, title: string, description: string) => void;// Function to rename an existing quiz, taking the quiz's unique ID, new title, and new description as parameters, and updating the corresponding quiz in the state.
  deleteQuiz: (id: string) => void;// Function to delete an existing quiz, taking the quiz's unique ID as a parameter, and removing the corresponding quiz from the state.

  addQuestion: (// Function to add a new question to a specific quiz, taking the quiz's unique ID, question text, an array of answer options, and the index of the correct answer as parameters, and appending the new question to the quiz's questions array.
    quizId: string,// The unique identifier of the quiz to which the question will be added.
    question: string,// The text of the question to be added to the quiz.
    options: string[],// An array of possible answer options for the question, allowing the user to select from multiple choices.
    correctIndex: number,// The index of the correct answer within the options array, indicating which option is the right answer for the question.
  ) => void;// Function to delete a question from a specific quiz, taking the quiz's unique ID and the question's unique ID as parameters, and removing the corresponding question from the quiz's questions array.
  deleteQuestion: (quizId: string, questionId: string) => void;// Function to delete a question from a specific quiz, taking the quiz's unique ID and the question's unique ID as parameters, and removing the corresponding question from the quiz's questions array.









  // High Scores ////================================================================////================================================================////================================================================////================================================================
  highScores: HighScore[];// An array of high scores achieved in quizzes or decks, each containing the associated deck ID, title, score, total questions, and the date the score was recorded.
  saveHighScore: (score: HighScore) => void; // Function to save a new high score entry, taking a HighScore object as a parameter
                                              // and appending it to the list of stored high scores in the application state.
  
  // Reset to static defaults--------------------------------------------  ////================================================================////================================================================////================================================================////======
  resetToStaticDefaults: () => void;  // Function to reset all stored data (decks, quizzes, and high scores) back to their
                                      // predefined static defaults, effectively clearing any user modifications and restoring
                                      // the initial mock data.

}



// createContext
const StorageContext = createContext<StorageContextType | undefined>(undefined);// React context that provides access to the storage state and functions (decks, quizzes,
                                                                                // high scores, and related operations) throughout the application. Initialized as undefined
                                                                                // until wrapped by the StorageProvider.





// ─── Provider ─────────────────────────────────────────────────────────────────

export const StorageProvider: React.FC<{ children: ReactNode }> = ({  // Context provider component that supplies the storage state and functions to its child
  children,                                                             // components. It initializes state with static mock data and exposes helper functions
                                                                            // (like resetToStaticDefaults) for managing decks, quizzes, and high scores.
}) => {

  // Initialized directly with rich static mock data (no AsyncStorage needed)
  const [decks, setDecks] = useState<Deck[]>(STATIC_DECKS);// An array of decks available in the application, each containing a unique ID,
                                                            // title, description, and an array of flashcards (question/answer pairs).

  const [quizzes, setQuizzes] = useState<Quiz[]>(STATIC_QUIZZES); // An array of quizzes available in the application, each containing a unique ID,
                                                                    // title, description, and an array of quiz questions.

  const [highScores, setHighScores] = useState<HighScore[]>(STATIC_HIGH_SCORES);  // An array of high scores achieved by users, each entry containing player details,
                                                                                    // score value, and metadata such as date/time.

  // ─── Reset Helper ───────────────────────────────────────────────────────────
  const resetToStaticDefaults = useCallback(() => {
    setDecks(STATIC_DECKS);
    setQuizzes(STATIC_QUIZZES);
    setHighScores(STATIC_HIGH_SCORES);
  }, []);
  // Function to reset all stored data (decks, quizzes, and high scores) back to
  // predefined static defaults, restoring the initial mock data.






  // ─── Deck In-Memory Operations ──────────────────────────────────────────────

  const createDeck = useCallback(// Function to create a new deck, taking a title and description as parameters,
                                      // generating a unique ID, and returning that ID after adding the deck to state.
    (title: string, description: string): string => {
      const id = makeId();
      const next: Deck = { id, title, description, cards: [] };
      setDecks((prev) => [...prev, next]);
      return id;
    },
    [],
  );

  const renameDeck = useCallback(    // Function to rename an existing deck, updating its title and description
                                          // based on the provided unique ID.
    (id: string, title: string, description: string) => {
      setDecks((prev) =>
        prev.map((d) => (d.id === id ? { ...d, title, description } : d)),
      );
    },
    [],
  );


  
  const deleteDeck = useCallback((id: string) => {  // Function to delete a deck, removing it from state using its unique ID.
    setDecks((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const addCard = useCallback(  // Function to add a new card (question/answer pair) to a specific deck,
                                  // identified by its unique ID.
    (deckId: string, question: string, answer: string) => {
      setDecks((prev) =>
        prev.map((d) => {
          if (d.id !== deckId) return d;
          return {
            ...d,
            cards: [...d.cards, { id: makeId(), question, answer }],
          };
        }),
      );
    },
    [],
  );

  const deleteCard = useCallback((deckId: string, cardId: string) => {  // Function to delete a card from a specific deck, using both the deck ID
                                                                           // and the card’s unique ID.
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id !== deckId) return d;
        return { ...d, cards: d.cards.filter((c) => c.id !== cardId) };
      }),
    );
  }, []);


  // ─── Quiz In-Memory Operations ──────────────────────────────────────────────

  const createQuiz = useCallback(
    (title: string, description: string): string => {
      const id = makeId();
      const next: Quiz = { id, title, description, questions: [] };
      setQuizzes((prev) => [...prev, next]);
      return id;
    },
    [],
  );
  // Function to create a new quiz, taking a title and description as parameters,
  // generating a unique ID, and returning that ID after adding the quiz to state.










  const renameQuiz = useCallback(
    (id: string, title: string, description: string) => {
      setQuizzes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, title, description } : q)),
      );
    },
    [],
  );
  // Function to rename an existing quiz, updating its title and description
  // based on the provided unique ID.











  const deleteQuiz = useCallback((id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  }, []);
  // Function to delete a quiz, removing it from state using its unique ID.





  const addQuestion = useCallback(
    (
      quizId: string,
      question: string,
      options: string[],
      correctIndex: number,
    ) => {
      setQuizzes((prev) =>
        prev.map((q) => {
          if (q.id !== quizId) return q;
          return {
            ...q,
            questions: [
              ...q.questions,
              { id: makeId(), question, options, correctIndex },
            ],
          };
        }),
      );
    },
    [],
  );
 // Function to add a new question to a specific quiz, taking the quiz ID,
  // question text, answer options, and the index of the correct answer.










  const deleteQuestion = useCallback((quizId: string, questionId: string) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id !== quizId) return q;
        return {
          ...q,
          questions: q.questions.filter((qs) => qs.id !== questionId),
        };
      }),
    );
  }, []);
  // Function to delete a question from a specific quiz, using both the quiz ID
  // and the question’s unique ID.











  // ─── High Scores In-Memory Operations ───────────────────────────────────────

  const saveHighScore = useCallback((score: HighScore) => {
    setHighScores((prev) => [score, ...prev]);
  }, []);
  // Function to save a new high score entry, taking a HighScore object as a parameter
  // and prepending it to the list of stored high scores.














  // ─── Context Value ───────────────────────────────────────────────────────────

  const value = useMemo(
    () => ({
      decks,
      createDeck,
      renameDeck,
      deleteDeck,
      addCard,
      deleteCard,
      quizzes,
      createQuiz,
      renameQuiz,
      deleteQuiz,
      addQuestion,
      deleteQuestion,
      highScores,
      saveHighScore,
      resetToStaticDefaults,
    }),
    [
      decks,
      createDeck,
      renameDeck,
      deleteDeck,
      addCard,
      deleteCard,
      quizzes,
      createQuiz,
      renameQuiz,
      deleteQuiz,
      addQuestion,
      deleteQuestion,
      highScores,
      saveHighScore,
      resetToStaticDefaults,
    ],
  );
  // Memoized object containing all state values and operations, passed down
  // through the StorageContext to child components.
  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};




// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useStorage = () => {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage must be used within StorageProvider');
  return ctx;
};
// Custom hook to access the StorageContext, ensuring it is only used within
// a StorageProvider. Throws an error if accessed outside the provider.