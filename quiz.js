const quizTitle = document.getElementById("quiz-title");
const quizContainer = document.getElementById("quiz-container");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");

let current = 0;
let score = 0;
let currentQuiz = [];

const quizzes = {
"Romeo and Juliet": [
  {
    question: "Where is Romeo and Juliet set?",
    options: ["Genoa", "Verona", "Venice", "Milan"],
    answer: "Verona"
  },
  {
    question: "Who is Juliet's cousin known for his temper?",
    options: ["Romeo", "Tybalt", "Benvolio", "Mercutio"],
    answer: "Tybalt"
  },
  {
    question: "Who secretly marries Romeo and Juliet?",
    options: ["Friar Laurence", "The Nurse", "Lord Capulet", "Prince Escalus"],
    answer: "Friar Laurence"
  },
  {
    question: "How does Juliet die?",
    options: ["Poison", "Sword wound", "Dagger", "Illness"],
    answer: "Dagger"
  },
  {
    question: "What causes the fight that leads to Mercutio's death?",
    options: ["Romeo's insult", "Tybalt's challenge", "The Capulet ball", "Paris's jealousy"],
    answer: "Tybalt's challenge"
  }
],

"Sense and Sensibility": [
  {
    question: "Who wrote Sense and Sensibility?",
    options: ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "Louisa May Alcott"],
    answer: "Jane Austen"
  },
  {
    question: "Which sister represents 'sense'?",
    options: ["Elinor", "Marianne", "Margaret", "Lucy"],
    answer: "Elinor"
  },
  {
    question: "Why must the Dashwood family leave their home?",
    options: ["They are evicted by creditors", "It is inherited by a male relative", "The property is sold", "They choose to move to London"],
    answer: "It is inherited by a male relative"
  },
  {
    question: "Who breaks Marianne's heart?",
    options: ["Edward Ferrars", "John Willoughby", "Colonel Brandon", "Robert Ferrars"],
    answer: "John Willoughby"
  },
  {
    question: "What theme is strongly explored in the novel?",
    options: ["Emotional restraint vs passion", "Gothic horror", "Industrial Revolution", "Political revolution"],
    answer: "Emotional restraint vs passion"
  }
]
};

const bookTitle = localStorage.getItem("activityBook");
if (!bookTitle || !quizzes[bookTitle]) {
  quizContainer.innerHTML = "<p>Sorry, no quiz available for this book.</p>";
} else {
  quizTitle.textContent = `${bookTitle} Quiz`;
  currentQuiz = quizzes[bookTitle];
  showQuestion();
}

function showQuestion() {
  const q = currentQuiz[current];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  nextBtn.classList.add("hidden");

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add('option-btn');

    btn.onclick = () => {
      [...optionsEl.children].forEach(b => {
        b.disabled = true;

        if (b.textContent === q.answer) {
          b.style.backgroundColor = "green";
          b.style.color = "white";
          b.innerHTML += " ✔️"; 
        }
        else if (b === btn) {
          b.style.backgroundColor = "red";
          b.style.color = "white";
          b.innerHTML += " ❌"; 
        }
      });

      if (option === q.answer) {
        score++;
      }

      nextBtn.classList.remove("hidden");
    };

    optionsEl.appendChild(btn);
  });
}

function saveQuizResults(bookTitle, score, totalQuestions) {
  const quizResults = {
    bookTitle,
    score,
    totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    date: new Date().toISOString()
  };
  
  let quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
  quizHistory.push(quizResults);
  localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current < currentQuiz.length) {
    showQuestion();
  } else {

saveQuizResults(bookTitle, score, currentQuiz.length);
    questionEl.textContent = "🎉 Quiz Finished!";
    optionsEl.innerHTML = "";
    nextBtn.classList.add("hidden");
    scoreEl.classList.remove("hidden");

    const percentage = (score / currentQuiz.length) * 100;
    let stars = "";
    if (percentage === 100) {
      stars = "🌟🌟🌟"; 
    } else if (percentage >= 50) {
      stars = "🌟🌟";
    } else {
      stars = "🌟"; 
    }

    scoreEl.innerHTML = `<strong>Your score:</strong> ${score} / ${currentQuiz.length} <br> ${stars} <br> <a href="quiz-results.html"> <button> View Your Results </button> </a> `;
    quizContainer.style.backgroundColor = "#e7f4d8";
    quizContainer.style.transition = "background 0.5s ease";
    quizContainer.classList.add("finished");
  }
});

document.addEventListener('DOMContentLoaded', function() {
 
  let quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];

  displayStats(quizHistory);

  displayRecentResults(quizHistory);
  
  displayBadges(quizHistory);
});

function displayStats(history) {
  const totalQuizzes = history.length;
  document.getElementById('total-quizzes').textContent = totalQuizzes;
  
  if (totalQuizzes > 0) {
    const totalScore = history.reduce((sum, quiz) => sum + quiz.percentage, 0);
    const averageScore = Math.round(totalScore / totalQuizzes);
    document.getElementById('average-score').textContent = `${averageScore}%`;
    
    const highestScore = Math.max(...history.map(quiz => quiz.percentage));
    document.getElementById('highest-score').textContent = `${highestScore}%`;
  }
}

function displayRecentResults(history) {
  const resultsContainer = document.getElementById('quiz-results');
  
  if (history.length === 0) {
    resultsContainer.innerHTML = '<p>No quiz results yet. Complete a quiz to see your achievements!</p>';
    return;
  }

  const recentResults = [...history].reverse().slice(0, 6);
  
  resultsContainer.innerHTML = recentResults.map(quiz => `
    <div class="quiz-result-card">
      <h3>${quiz.bookTitle}</h3>
      <div class="score">${quiz.score}/${quiz.totalQuestions}</div>
      <div class="stars">${getStars(quiz.percentage)}</div>
      <div class="date">${new Date(quiz.date).toLocaleDateString()}</div>
      <div class="progress-ring">
        <svg width="100" height="100">
          <circle class="progress-ring__circle--background" 
                  stroke-width="8" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50"/>
          <circle class="progress-ring__circle--progress" 
                  stroke-width="8" 
                  stroke-dasharray="${calculateDashArray(quiz.percentage)}" 
                  stroke-dashoffset="0" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50"/>
        </svg>
        <div class="progress-ring__text">${quiz.percentage}%</div>
      </div>
    </div>
  `).join('');
}

function displayBadges(history) {
  const badgesContainer = document.getElementById('badges');
  const badges = [];
  

  if (history.length >= 1) {
    badges.push({
      icon: 'fa-solid fa-award',
      title: 'First Quiz',
      description: 'Completed your first quiz'
    });
  }
  
  if (history.length >= 5) {
    badges.push({
      icon: 'fa-solid fa-trophy',
      title: 'Quiz Enthusiast',
      description: 'Completed 5 quizzes'
    });
  }
  
  const perfectScores = history.filter(quiz => quiz.percentage === 100).length;
  if (perfectScores >= 1) {
    badges.push({
      icon: 'fa-solid fa-medal',
      title: 'Perfect Score',
      description: 'Got 100% on a quiz'
    });
  }
  
  if (history.some(quiz => quiz.percentage >= 80)) {
    badges.push({
      icon: 'fa-solid fa-star',
      title: 'Top Performer',
      description: 'Scored 80% or higher'
    });
  }
  
  if (badges.length === 0) {
    badgesContainer.innerHTML = '<p>Complete quizzes to earn badges!</p>';
    return;
  }
  
  badgesContainer.innerHTML = badges.map(badge => `
    <div class="badge-card">
      <i class="${badge.icon}"></i>
      <h3>${badge.title}</h3>
      <p>${badge.description}</p>
    </div>
  `).join('');
}


function getStars(percentage) {
  const starCount = Math.ceil(percentage / 20);
  return '★'.repeat(starCount);
}

function calculateDashArray(percentage) {
  const circumference = 2 * Math.PI * 40;
  return `${(circumference * percentage / 100)} ${circumference}`;
}




