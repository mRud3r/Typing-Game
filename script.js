const wordsBox = document.querySelector(".words");
const gameArea = document.querySelector(".game");
const gameTimer = document.querySelector(".timer");
const newGameBtn = document.getElementById("new-game-btn");
const wpmDisplay = document.getElementById("wpm");
const cpmDisplay = document.getElementById("cpm");
const accuracyDisplay = document.getElementById("accuracy");
const randomWords =
	"winner coffee pizza heart night agency river map phone theory sector topic son ladder energy piano policy shirt blood event dinner tennis affair way year tongue idea dad sister ear data steak oven effort hotel song gate city virus video woman device beer desk bath sample volume ball beer desk bath hall news drawer studio art meal honey mom coffee safety aspect love nation tooth poem uncle length gate music child math cancer leader poet apple stem submit sound remind sue access become file extend sell abuse crawl tend step force share like lay rush sign smell assume wash smile reply cheer retain flee scream grip matter".split(
		" "
	);
let timeLeft = 60;
let timerInterval = null;
let timerStarted = false;
let correctChars = 0;
let incorrectChars = 0;
let totalCorrectWords = 0;

const createRandomWord = () => {
	const randomIndex = Math.floor(Math.random() * randomWords.length);
	return randomWords[randomIndex];
};

const addClass = (el, val) => {
	el.classList.add(val);
};

const removeClass = (el, val) => {
	el.classList.remove(val);
};

const formatWord = (word) => {
	let formattedWord = "";
	for (let i = 0; i < word.length; i++) {
		formattedWord += `<span class="letter">${word[i]}</span>`;
	}
	return `<div class="word">${formattedWord}</div>`;
};

const startGame = () => {
	wordsBox.innerHTML = "";
	for (let i = 0; i < 100; i++) {
		wordsBox.innerHTML += formatWord(createRandomWord());
	}
	addClass(document.querySelector(".word"), "current");
	addClass(document.querySelector(".letter"), "current");
	wordsBox.scrollLeft = 0; // Resetowanie przewijania
	gameArea.focus();
	resetStats();
};

const resetStats = () => {
	correctChars = 0;
	incorrectChars = 0;
	totalCorrectWords = 0;
	updateStats();
};

const updateStats = () => {
	const cpm = correctChars;
	const wpm = totalCorrectWords;
	const accuracy = Math.round(
		(correctChars / (correctChars + incorrectChars)) * 100
	);

	cpmDisplay.textContent = cpm;
	wpmDisplay.textContent = wpm;
	accuracyDisplay.textContent = isNaN(accuracy) ? 0 : accuracy;
};

const resetGame = () => {
	clearInterval(timerInterval);
	timeLeft = 60;
	gameTimer.textContent = timeLeft;
	timerStarted = false;
	gameArea.removeEventListener("keydown", handleKeydown);
	startGame();
	gameArea.addEventListener("keydown", handleKeydown);
};

const startTimer = () => {
	timerInterval = setInterval(() => {
		if (timeLeft > 0) {
			timeLeft--;
			gameTimer.textContent = timeLeft;
		} else {
			clearInterval(timerInterval);
			gameArea.removeEventListener("keydown", handleKeydown);
			gameArea.blur();
		}
	}, 1000);
};

const handleKeydown = (e) => {
	const key = e.key;
	const currentLetter = document.querySelector(".letter.current");
	const currentWord = document.querySelector(".word.current");
	const expected = currentLetter?.innerHTML || " ";
	const isLetter = key.length === 1 && key !== " ";
	const isSpace = key === " ";
	const isBackspace = key === "Backspace";
	const isFirstLetter = currentLetter === currentWord.firstChild;

	if (!timerStarted) {
		timerStarted = true;
		startTimer();
	}

	if (isLetter) {
		if (currentLetter) {
			if (key === expected) {
				correctChars++;
				addClass(currentLetter, "correct");
			} else {
				incorrectChars++;
				addClass(currentLetter, "incorrect");
			}
			removeClass(currentLetter, "current");
			if (currentLetter.nextSibling) {
				addClass(currentLetter.nextSibling, "current");
			}
		} else {
			incorrectChars++;
			const incorrectLetter = document.createElement("span");
			incorrectLetter.innerHTML = key;
			incorrectLetter.className = "letter incorrect extra";
			currentWord.appendChild(incorrectLetter);
		}
	}

	if (isSpace) {
		const isWordCorrect = ![...currentWord.querySelectorAll(".letter")].some(
			(letter) => letter.classList.contains("incorrect")
		);

		if (isWordCorrect) {
			totalCorrectWords++;
		}

		removeClass(currentWord, "current");
		addClass(currentWord.nextSibling, "current");
		if (currentLetter) {
			removeClass(currentLetter, "current");
		}
		addClass(currentWord.nextSibling.firstChild, "current");

		const currentWordWidth = currentWord.offsetWidth + 10;
		scrollWordsBox(currentWordWidth);
	}

	if (isBackspace) {
		if (currentLetter && isFirstLetter) {
			const previousWord = currentWord.previousSibling;
			if (previousWord) {
				removeClass(currentWord, "current");
				addClass(previousWord, "current");
				removeClass(currentLetter, "current");
				addClass(previousWord.lastChild, "current");
				removeClass(previousWord.lastChild, "correct");
				removeClass(previousWord.lastChild, "incorrect");

				const previousWordWidth = previousWord.offsetWidth + 10;
				scrollWordsBox(-previousWordWidth);
			}
		}
		if (currentLetter && !isFirstLetter) {
			removeClass(currentLetter, "current");
			addClass(currentLetter.previousSibling, "current");
			removeClass(currentLetter.previousSibling, "correct");
			removeClass(currentLetter.previousSibling, "incorrect");
		}
		if (!currentLetter) {
			addClass(currentWord.lastChild, "current");
			removeClass(currentWord.lastChild, "correct");
			removeClass(currentWord.lastChild, "incorrect");
		}
	}

	updateStats();
};

const scrollWordsBox = (distance) => {
	wordsBox.scrollLeft += distance;
};

newGameBtn.addEventListener("click", resetGame);
gameArea.addEventListener("keydown", handleKeydown);
startGame();
