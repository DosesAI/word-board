'use strict';

(function () {
  const STORAGE_KEY = 'word-board:button-size';
  const SIZES = ['standard', 'large', 'x-large'];
  const DEFAULT_SIZE = 'standard';
  const root = document.documentElement;

  function readSavedSize() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return SIZES.includes(saved) ? saved : DEFAULT_SIZE;
    } catch {
      // Storage can be blocked (e.g. some private browsing modes): use the default.
      return DEFAULT_SIZE;
    }
  }

  function saveSize(size) {
    try {
      localStorage.setItem(STORAGE_KEY, size);
    } catch {
      // Not remembered this time, but the page keeps working.
    }
  }

  function applySize(size) {
    root.dataset.buttonSize = size;
  }

  // Inserts the word at the caret (replacing any selected text), adding a space
  // only where one is needed, so a word can also go back into the middle of a sentence.
  function insertWord(textarea, word) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.slice(0, start);
    const after = textarea.value.slice(end);
    const spaceBefore = before && !/\s$/.test(before) ? ' ' : '';
    const spaceAfter = after && !/^\s/.test(after) ? ' ' : '';
    textarea.setRangeText(spaceBefore + word + spaceAfter, start, end, 'end');
  }

  // This script runs before the body is parsed, so the saved size is in place for the first paint.
  applySize(readSavedSize());

  document.addEventListener('DOMContentLoaded', function () {
    const message = document.getElementById('message');
    const words = document.getElementById('words');
    const sizeInputs = document.querySelectorAll('input[name="button-size"]');

    // One listener for all the word buttons. Native buttons fire "click" for mouse,
    // touch and pen, and for Enter and Space, so pointer and keyboard share one path.
    // Focus stays on the button, so keyboard users keep their place between words.
    words.addEventListener('click', function (event) {
      const button = event.target.closest('button');
      if (button) insertWord(message, button.textContent.trim());
    });

    sizeInputs.forEach(function (input) {
      input.checked = input.value === root.dataset.buttonSize;
      input.addEventListener('change', function () {
        applySize(input.value);
        saveSize(input.value);
      });
    });
  });
})();
