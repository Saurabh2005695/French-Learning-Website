function showSection(id){
    document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    if (id === 'quiz') {
        startQuiz();
    }
}

const synth = window.speechSynthesis;
let voices = [];
let preferredVoice = null;

function loadVoices() {
    voices = synth.getVoices() || [];
    if (!voices.length) return;
    // Prefer a French voice; try to prefer female-sounding name if available
    preferredVoice =
        voices.find(v => /^fr\b/i.test(v.lang) && /fem|femme|female|woman|frau/i.test(v.name)) ||
        voices.find(v => /^fr\b/i.test(v.lang)) ||
        voices.find(v => v.lang && v.lang.startsWith('fr')) ||
        voices[0];
}
synth.onvoiceschanged = loadVoices;
loadVoices();

function speak(text, lang = 'fr-FR') {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    if (!preferredVoice) loadVoices();
    if (preferredVoice) utter.voice = preferredVoice;
    else {
        const fallback = synth.getVoices().find(v => v.lang && v.lang.startsWith('fr'));
        if (fallback) utter.voice = fallback;
    }
    utter.rate = 0.95;
    utter.pitch = 1.1;
    utter.volume = 1;
    synth.cancel();
    synth.speak(utter);
}

// Flashcards
const cards=[
    {fr:"Bonjour",en:"Hello"},
    {fr:"Merci",en:"Thank you"},
    {fr:"S'il vous plaît",en:"Please"},
    {fr:"Rouge",en:"Red"},
    {fr:"Bleu",en:"Blue"},
    {fr:"Chat",en:"Cat"},
    {fr:"Chien",en:"Dog"}
];
let i=0,front=true;

function showCard(){
    document.getElementById("flashcard").textContent=front?cards[i].fr:cards[i].en;
}
showCard();

function flipCard(){front=!front; showCard();}
function nextCard(){i=(i+1)%cards.length; front=true; showCard();}
function prevCard(){i=(i-1+cards.length)%cards.length; front=true; showCard();}
function speakCard(){speak(cards[i].fr);}

// Quiz
const quizQuestions = [
    // Number questions
    {
        question: "What is 'five' in French?",
        options: ["quatre", "cinq", "six", "sept"],
        correct: "cinq"
    },
    {
        question: "How do you say 'ten' in French?",
        options: ["neuf", "onze", "dix", "douze"],
        correct: "dix"
    },
    {
        question: "What is 'fifteen' in French?",
        options: ["quinze", "seize", "quatorze", "treize"],
        correct: "quinze"
    },
    {
        question: "Translate 'trois' to English:",
        options: ["two", "three", "four", "five"],
        correct: "three"
    },
    // Alphabet questions
    {
        question: "How is the letter 'W' pronounced in French?",
        options: ["way", "doobluh-vay", "doobluh", "vay"],
        correct: "doobluh-vay"
    },
    {
        question: "What is the correct pronunciation of 'J' in French?",
        options: ["jay", "zhee", "jee", "zhay"],
        correct: "zhee"
    },
    {
        question: "How do you pronounce 'Y' in French?",
        options: ["ee-grek", "way", "ee", "york"],
        correct: "ee-grek"
    },
    // Mixed questions
    {
        question: "What number is 'dix-huit'?",
        options: ["16", "17", "18", "19"],
        correct: "18"
    },
    {
        question: "Which letter makes the 'say' sound in French?",
        options: ["S", "C", "Z", "X"],
        correct: "C"
    },
    {
        question: "What is 'vingt' in English?",
        options: ["18", "19", "20", "21"],
        correct: "20"
    }
];

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const scoreEl = document.getElementById('score');
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionEl.textContent = `Question ${currentQuestionIndex + 1}/${quizQuestions.length}: ${currentQuestion.question}`;
    
    optionsEl.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'quiz-option';
        button.onclick = () => checkAnswer(option);
        optionsEl.appendChild(button);
    });
    
    scoreEl.textContent = `Score: ${score}/${quizQuestions.length}`;
}

function checkAnswer(selected) {
    const current = quizQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.quiz-option');
    
    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === current.correct) {
            button.classList.add('correct');
        } else if (button.textContent === selected) {
            button.classList.add(selected === current.correct ? 'correct' : 'wrong');
        }
    });

    if (selected === current.correct) {
        score++;
        speak('Très bien!', 'fr-FR');
    } else {
        speak('Non, essayez encore.', 'fr-FR');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    }, 1500);
}

function endQuiz() {
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const scoreEl = document.getElementById('score');
    
    questionEl.textContent = "Quiz Complete!";
    optionsEl.innerHTML = `
        <p>Final Score: ${score}/${quizQuestions.length}</p>
        <button onclick="startQuiz()">Try Again</button>
    `;
    scoreEl.textContent = `You got ${Math.round((score/quizQuestions.length) * 100)}% correct!`;
}

//# sourceMappingURL=app.js.map
