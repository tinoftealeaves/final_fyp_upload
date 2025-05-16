function renderBookshelf() {
  const container = document.getElementById("bookshelf-container");
  const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];

  container.innerHTML = "";

  if (bookshelf.length === 0) {
    container.innerHTML = "<p>Your bookshelf is empty. Go to the Shop to add books!</p>";
  } else {
    bookshelf.forEach((book, index) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book";

      bookCard.innerHTML = `
  <button class="delete-btn" onclick="removeBook(${index})">🗑️</button>
  <img src="${book.image}" alt="${book.title}" />
  <h2>${book.title}</h2>
  <button onclick="readNow('${book.title}', '${book.image}')">Read Book</button>
`;


      container.appendChild(bookCard);
    });
  }
}

function readNow(title, image) {
  localStorage.setItem("currentBook", JSON.stringify({ title, image }));
  
  if (title === "Sense and Sensibility") {
    window.location.href = "sense_chapter_4.html";
  } else {
    window.location.href = "download_in_progress.html";
  }
}


function removeBook(index) {
  let bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];

  bookshelf.splice(index, 1);
  localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
  renderBookshelf(); 
}

function clearBookshelf() {
  const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];

  if (bookshelf.length === 0) {
    showToast("Your bookshelf is already empty!");
    return;
  }

  const modal = document.getElementById("confirm-popup");
  modal.classList.remove("hidden");
}

function confirmClear() {
  localStorage.removeItem("bookshelf");
  renderBookshelf(); 
  document.getElementById("confirm-popup").classList.add("hidden");
}

function cancelClear() {
  const modal = document.getElementById("confirm-popup");
  modal.classList.add("hidden");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 2500);
}

renderBookshelf();


//POP-UP
document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('bookshelf-popup');
  

  setTimeout(function() {
    popup.classList.add('active');
  }, 1000);
  
 
  document.getElementById('close-popup').addEventListener('click', function() {
    popup.classList.remove('active');
  });
  
  document.getElementById('accept-popup').addEventListener('click', function() {
    popup.classList.remove('active');
  });
  

  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      popup.classList.remove('active');
    }
  });
});
