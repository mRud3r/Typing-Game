const wordsBox = document.querySelector(".words");
const gameArea = document.querySelector(".game");
const gameTimer = document.querySelector(".timer");
const randomWords =
	"plausible dreamless make thermodynamics raid composure bicycle none run shoal involution storm dolce imaging cutaway member bootleg Nycticorax landmark regulation".split(
		" "
	);
const wordsCount = randomWords.length;


const createRandomWord = () => {
	const randomIndex = Math.floor(Math.random() * randomWords.length);
	return randomWords[randomIndex];
};

const addClass = (el, val) => {
	el.className += " " + val;
};

const removeClass = (el, val) => {
	el.className = el.className.replace(val, "");
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
	window.timer = null;
	gameArea.focus();
};

const scrollWordsBox = (distance) => {
    wordsBox.scrollLeft += distance;
};

gameArea.addEventListener("keydown", (e) => {
	const key = e.key;
	const currentLetter = document.querySelector(".letter.current");
	const currentWord = document.querySelector(".word.current");
	const expected = currentLetter?.innerHTML || ' ';
	const isLetter = key.length === 1 && key !== " ";
	const isSpace = key === " ";
    const isBackspace = key === "Backspace";
    const isFirstLetter = currentLetter === currentWord.firstChild;


	if (isLetter) {
		if (currentLetter) {
			addClass(currentLetter, key === expected ? "correct" : "incorrect");
			removeClass(currentLetter, "current");
			if (currentLetter.nextSibling) {
				addClass(currentLetter.nextSibling, "current");
			}
		} else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
	}

	if (isSpace) {
		if (expected !== " ") {
			const lettersToInvalidate = [
				...currentWord.querySelectorAll(".letter:not(.correct)"),
			];
			lettersToInvalidate.forEach((letter) => {
				addClass(letter, "incorrect");
			});
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
                removeClass(currentWord, 'current');
                addClass(previousWord, 'current');
                removeClass(currentLetter, 'current');
                addClass(previousWord.lastChild, 'current');
                removeClass(previousWord.lastChild, 'correct');
                removeClass(previousWord.lastChild, 'incorrect');

                const previousWordWidth = previousWord.offsetWidth + 10;
                scrollWordsBox(-previousWordWidth);
            }
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'correct');
            removeClass(currentLetter.previousSibling, 'incorrect');
        }
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'correct');
            removeClass(currentWord.lastChild, 'incorrect');
        }
    }
});

startGame();
