document.addEventListener('DOMContentLoaded', function() {
  // GET HISTORY
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
  
  // MOST RECENT FIRST
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
  
  // BADGES EARNED
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


