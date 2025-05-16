function updateBookshelfDropdown() {
    const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
    const dropdown = document.getElementById("bookshelf-preview");
  
    dropdown.innerHTML = ""; 
  
    
    if (bookshelf.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Your bookshelf is empty";
      dropdown.appendChild(li);
      return;
    }
  
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
    
  document.addEventListener("DOMContentLoaded", () => {
    updateBookshelfDropdown();
  });
  