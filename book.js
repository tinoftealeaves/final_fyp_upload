let isHighlighting = false;
let lastHighlightedText = "";
let lastHighlightedSpan = null;
let lastHighlightedHTML = null;



document.addEventListener("DOMContentLoaded", () => {
 
  function loadBookText(filename) {
    fetch(filename)
      .then(response => response.text())
      .then(raw => {

        let text = raw.replace(/\r\n?/g, "\n");
        text = text.replace(/"(?=\s)/g, '"\n\n');

        const paragraphs = text
          .split(/\n{2,}/)
          .map(p => `<p>${p.trim()}</p>`)
          .join("");

        const container = document.getElementById("book-text");
        if (container) container.innerHTML = paragraphs;
      })
      .catch(err => {
        console.error("Failed to load book text:", err);
        const container = document.getElementById("book-text");
        if (container) container.textContent = "Failed to load book text.";
      });
  }


  document.getElementById("book-text").addEventListener("mouseup", () => {
    if (isHighlighting) return; 
  
    const selection = window.getSelection().toString().trim();
if (selection && selection.split(/\s+/).length === 1) {
  fetchDefinition(selection);
}
});
   


  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  if (prevBtn) prevBtn.addEventListener("click", prevPage);
  if (nextBtn) nextBtn.addEventListener("click", nextPage);

  let touchStartX = 0;
  const swipeThreshold = 50;
  if (reader) {
    reader.addEventListener("touchstart", e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    reader.addEventListener("touchend", e => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) < swipeThreshold) return;
      if (dx < 0) nextPage(); else prevPage();
      
      
      const nav = document.querySelector("nav");
      const main = document.querySelector("main");
      if (nav && main) {
        const navHeight = nav.getBoundingClientRect().height;
        main.style.paddingTop = `${navHeight}px`;
      }
     });
  }
  
  function showDefinition(message) {
    const popup = document.getElementById("dictionary-popup");
    const defText = document.getElementById("definition-text");
    if (defText) defText.textContent = message;
    if (popup) popup.classList.remove("hidden");
  }

  function closeDefinition() {
    const popup = document.getElementById("dictionary-popup");
    if (popup) popup.classList.add("hidden");
  }

  document.getElementById("close-dict").addEventListener("click", closeDefinition);

  function fetchDefinition(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(res => res.json())
      .then(data => {
        const def = data[0]?.meanings[0]?.definitions[0]?.definition;
        showDefinition(def ? `${word}: ${def}` : `${word}: No definition found.`);
      })
      .catch(err => {
        console.error("Dictionary fetch error:", err);
        showDefinition(`${word}: No definition found.`);
      });
  }

  document.getElementById("book-text").addEventListener("mouseup", () => {
    if (isHighlighting) return;
  
    const selection = window.getSelection();
    const word = selection.toString().trim();
  
    const isSingleWord = /^[a-zA-Z]+$/.test(word);
  
    if (word && isSingleWord) {
      fetchDefinition(word);
    }
  });

  const closeBtn = document.getElementById("close-dict");
  if (closeBtn) closeBtn.addEventListener("click", closeDefinition);

});

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-dict");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const popup = document.getElementById("dictionary-popup");
      if (popup) popup.classList.add("hidden");
    });
  }

});

function highlightSelectedWord() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (!selectedText && justHighlighted && lastHighlightedSpan && lastHighlightedSpan.parentNode) {
    const parent = lastHighlightedSpan.parentNode;
    const textNode = document.createTextNode(lastHighlightedSpan.textContent);
    parent.replaceChild(textNode, lastHighlightedSpan);

    lastHighlightedSpan = null;
    lastHighlightedHTML = null;
    justHighlighted = false;
    return;
  }

  if (!selection || !selectedText || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");
  span.className = "highlighted";
  span.textContent = selectedText;


  lastHighlightedSpan = span;
  lastHighlightedHTML = range.cloneContents();
  justHighlighted = true;

  range.deleteContents();
  range.insertNode(span);
  selection.removeAllRanges();
}

