function showSection(id){
    document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
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
const quiz=[
    {q:"Bonjour means?",o:["Hello","Bye","Thanks"],a:"Hello"},
    {q:"Merci means?",o:["Sorry","Thank you","See you"],a:"Thank you"},
    {q:"Bleu means?",o:["Yellow","Blue","Green"],a:"Blue"},
];
let qi=0,score=0;

function loadQuiz(){
    document.getElementById("question").textContent=quiz[qi].q;
    const opt=document.getElementById("options");
    opt.innerHTML="";
    quiz[qi].o.forEach(x=>{
        let b=document.createElement("button");
        b.textContent=x;
        b.onclick=()=>check(x);
        opt.appendChild(b);
    });
}
function check(x){
    if(x==quiz[qi].a) score++;
    qi++;
    if(qi<quiz.length) loadQuiz();
    else document.getElementById("score").textContent=`Score: ${score}/${quiz.length}`;
}
loadQuiz();
