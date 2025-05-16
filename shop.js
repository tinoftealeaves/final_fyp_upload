document.addEventListener("DOMContentLoaded", () =>{
  updateBookshelfDropdown();

  const downloadBtn = document.getElementById("download-btn");
  const readBtn     = document.getElementById("read-btn");
  if (downloadBtn && readBtn) {

    const titleEl = document.querySelector(".book-info h1");
    const title   = titleEl ? titleEl.textContent.trim() : null;

    const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
    const owned     = title && bookshelf.some(b => b.title === title);

    if (owned) {
      downloadBtn.classList.add("hidden");
      readBtn.classList.remove("hidden");
    }
  }
});

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

function addToBookshelf(title, image) {
  let bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];

  const alreadyAdded = bookshelf.some(book => book.title === title);
  if (alreadyAdded) {
    showToast(`${title} is already in your bookshelf!`);
    return;
  }

  bookshelf.push({ title, image });
  localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
  showToast(`${title} added to your bookshelf!`);
}


function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}


window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
} 

function handleDownload(title,image){
  addToBookshelf(title, image);

  document.getElementById("download-btn").classList.add("hidden");
  document.getElementById("read-btn").classList.remove("hidden");
}

function readNow(title,image) {
  const bookData = {title,image};
  localStorage.setItem("currentBook", JSON.stringify(bookData));
  window.location.href ="book.html"
}

function updateBookshelfDropdown() {
  const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
  const dropdown = document.getElementById("bookshelf-preview");

  dropdown.innerHTML = ""; 

  const previewBooks = bookshelf.slice(0, 2);
  previewBooks.forEach(book => {
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.textContent = book.title;
    link.onclick = () => {
      localStorage.setItem("currentBook", JSON.stringify(book));
      window.location.href = "book.html";
    };

    li.appendChild(link);
    dropdown.appendChild(li);
  });

  if (bookshelf.length > 2) {
    const viewAll = document.createElement("li");
    const link = document.createElement("a");
    link.href = "bookshelf.html";
    link.textContent = "+ View All";
    viewAll.appendChild(link);
    dropdown.appendChild(viewAll);
  }
}

