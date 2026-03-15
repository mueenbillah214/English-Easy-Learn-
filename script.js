// Theme toggle
const toggleBtn = document.getElementById('themeToggle');
toggleBtn.onclick = () => {
  document.body.classList.toggle('dark');
  toggleBtn.innerHTML = document.body.classList.contains('dark') 
    ? '<i class="fas fa-sun"></i> Light Mode' 
    : '<i class="fas fa-moon"></i> Dark Mode';
};

// Daily word
const words = [
  {en: "Hello", bn: "হ্যালো", ex: "Hello, how are you today?"},
  {en: "Thank you", bn: "ধন্যবাদ", ex: "Thank you for the gift."},
  {en: "Please", bn: "দয়া করে", ex: "Please help me."},
  {en: "Sorry", bn: "দুঃখিত", ex: "Sorry for being late."},
  {en: "Friend", bn: "বন্ধু", ex: "She is my best friend."},
  {en: "Family", bn: "পরিবার", ex: "Family is important."},
  {en: "Happy", bn: "খুশি", ex: "I am happy today."},
  {en: "Good", bn: "ভালো", ex: "This is a good idea."},
  {en: "Home", bn: "বাড়ি", ex: "I love my home."},
  {en: "School", bn: "স্কুল", ex: "School starts at 8 AM."},
  {en: "Water", bn: "পানি", ex: "Drink water every day."},
  {en: "Food", bn: "খাবার", ex: "I like spicy food."},
  {en: "Love", bn: "ভালোবাসা", ex: "I love my country Bangladesh."},
  {en: "Time", bn: "সময়", ex: "Time flies fast."},
  {en: "Work", bn: "কাজ", ex: "Hard work pays off."},
  {en: "Dream", bn: "স্বপ্ন", ex: "Follow your dreams."},
  {en: "Book", bn: "বই", ex: "Read a book daily."},
  {en: "Phone", bn: "ফোন", ex: "Call me on my phone."},
  {en: "Yes", bn: "হ্যাঁ", ex: "Yes, I agree."},
  {en: "No", bn: "না", ex: "No, thank you."}
];

const randomWord = words[Math.floor(Math.random() * words.length)];
document.getElementById("dailyWord").innerHTML = `
  <strong>${randomWord.en}</strong> (${randomWord.bn})<br>
  Example: ${randomWord.ex}<br>
  <button class="pronounce-btn" onclick="speak('${randomWord.en}')"><i class="fas fa-volume-up"></i> Listen</button>
`;

// Vocabulary list with search
let vocabHTML = "";
words.forEach(w => {
  vocabHTML += `
    <div class="vocab-item">
      <h3>${w.en}</h3>
      <p>Bangla: ${w.bn}</p>
      <p>Example: ${w.ex}</p>
      <button class="pronounce-btn" onclick="speak('${w.en}')"><i class="fas fa-volume-up"></i> Listen</button>
    </div>
  `;
});
const vocabContainer = document.getElementById("vocabList");
vocabContainer.innerHTML = vocabHTML;

document.getElementById("searchInput").oninput = e => {
  const term = e.target.value.toLowerCase();
  const items = document.querySelectorAll(".vocab-item");
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(term) ? "block" : "none";
  });
};

// Pronunciation
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  } else {
    alert("Your browser doesn't support speech. Try Chrome!");
  }
}

// Quiz
const quizQuestions = [
  { q: "What does 'Hello' mean?", opts: ["ধন্যবাদ", "হ্যালো", "দুঃখিত", "বন্ধু"], ans: 1 },
  { q: "'Thank you' এর অর্থ কী?", opts: ["ধন্যবাদ", "দয়া করে", "খুশি", "ভালো"], ans: 0 },
  { q: "Friend মানে?", opts: ["পরিবার", "বন্ধু", "স্কুল", "খাবার"], ans: 1 },
  { q: "Happy = ?", opts: ["দুঃখী", "খুশি", "ক্লান্ত", "ভয়"], ans: 1 },
  { q: "'Water' এর বাংলা কী?", opts: ["খাবার", "পানি", "বই", "ফোন"], ans: 1 },
  { q: "What is 'Home'?", opts: ["স্কুল", "বাড়ি", "কাজ", "সময়"], ans: 1 },
  { q: "Love মানে?", opts: ["ঘৃণা", "ভালোবাসা", "স্বপ্ন", "বই"], ans: 1 },
  { q: "'Good' এর অর্থ?", opts: ["খারাপ", "ভালো", "দ্রুত", "ধীর"], ans: 1 },
  { q: "Dream = ?", opts: ["বাস্তব", "স্বপ্ন", "কাজ", "খেলা"], ans: 1 },
  { q: "'Yes' মানে কী?", opts: ["না", "হ্যাঁ", "হয়তো", "কখনো না"], ans: 1 }
];

let current = 0, score = 0, timerInterval, timeLeft = 15;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const feedbackEl = document.getElementById("feedback");
const timerEl = document.getElementById("timer");

function startTimer() {
  timeLeft = 15;
  timerEl.textContent = `Time left: ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function loadQuestion() {
  if (current >= quizQuestions.length) {
    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("score").textContent = score;
    document.getElementById("percent").textContent = ((score / quizQuestions.length) * 100).toFixed(0);
    clearInterval(timerInterval);
    return;
  }

  const q = quizQuestions[current];
  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  timerEl.textContent = "Time left: 15s";

  q.opts.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsEl.appendChild(btn);
  });

  nextBtn.disabled = true;
  startTimer();
}

function checkAnswer(selected) {
  clearInterval(timerInterval);
  const correct = quizQuestions[current].ans;
  const buttons = optionsEl.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    if (i === correct) btn.classList.add("correct");
    if (i === selected && i !== correct) btn.classList.add("wrong");
  });

  if (selected === correct) {
    score++;
    feedbackEl.textContent = "Correct! ✅";
    feedbackEl.style.color = "green";
  } else {
    feedbackEl.textContent = `Wrong! The correct answer is: ${quizQuestions[current].opts[correct]}`;
    feedbackEl.style.color = "red";
  }

  nextBtn.disabled = false;
}

function nextQuestion() {
  current++;
  loadQuestion();
}

nextBtn.onclick = nextQuestion;

document.getElementById("restart").onclick = () => {
  current = 0;
  score = 0;
  document.getElementById("quizContainer").style.display = "block";
  document.getElementById("result").style.display = "none";
  loadQuestion();
};

// Start
loadQuestion();