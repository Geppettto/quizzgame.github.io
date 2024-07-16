const capitals = {
  Albanien: "Tirana",
  Andorra: "Andorra la Vella",
  Armenien: "Jerewan",
  Österreich: "Wien",
  Aserbaidschan: "Baku",
  Weißrussland: "Minsk",
  Belgien: "Brüssel",
  "Bosnien und Herzegowina": "Sarajevo",
  Bulgarien: "Sofia",
  Kroatien: "Zagreb",
  Zypern: "Nikosia",
  Tschechien: "Prag",
  Dänemark: "Kopenhagen",
  Estland: "Tallinn",
  Finnland: "Helsinki",
  Frankreich: "Paris",
  Georgien: "Tiflis",
  Deutschland: "Berlin",
  Griechenland: "Athen",
  Ungarn: "Budapest",
  Island: "Reykjavik",
  Irland: "Dublin",
  Italien: "Rom",
  Kasachstan: "Astana",
  Kosovo: "Pristina",
  Lettland: "Riga",
  Liechtenstein: "Vaduz",
  Litauen: "Vilnius",
  Luxemburg: "Luxemburg",
  Malta: "Valletta",
  Moldawien: "Chisinau",
  Monaco: "Monaco",
  Montenegro: "Podgorica",
  Niederlande: "Amsterdam",
  Nordmazedonien: "Skopje",
  Norwegen: "Oslo",
  Polen: "Warschau",
  Portugal: "Lissabon",
  Rumänien: "Bukarest",
  Russland: "Moskau",
  "San Marino": "San Marino",
  Serbien: "Belgrad",
  Slowakei: "Bratislava",
  Slowenien: "Ljubljana",
  Spanien: "Madrid",
  Schweden: "Stockholm",
  Schweiz: "Bern",
  Türkei: "Ankara",
  Ukraine: "Kiew",
  "Vereinigtes Königreich": "London",
  Vatikanstadt: "Vatikanstadt",
};

let quizOrder = [];
let correctAnswers = 0;
let incorrectAnswers = 0;
let currentQuestionIndex = 0;
let currentAttempts = 0;
let incorrectCapitals = new Set();
let showAnswerMode = false;
let competitiveMode = false;
let learningMode = false;
let startTime, timerInterval;
let bestTime = Infinity;

function showHome() {
  document.getElementById("mode-selection").style.display = "block";
  document.getElementById("learn-container").style.display = "none";
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("competitive-container").style.display = "none";
  document.getElementById("result-container").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.querySelector("#quiz-buttons button:nth-child(2)").style.display = "inline-block";
}

function selectMode(mode) {
  showAnswerMode = mode === "show-answer";
  competitiveMode = mode === "competitive";
  learningMode = mode === "show-answer";
  document.getElementById("mode-selection").style.display = "none";
  if (competitiveMode) {
    document.getElementById("competitive-container").style.display = "block";
  } else {
    document.getElementById("learn-container").style.display = "block";
    populateCapitals();
  }
}

function startCompetitive() {
  document.getElementById("competitive-container").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("timer").style.display = "block";
  document.querySelector("#quiz-buttons button:nth-child(2)").style.display = "none"; // Hide skip button in competitive mode
  quizOrder = shuffle(Object.keys(capitals));
  startTime = new Date(); // Start timer
  timerInterval = setInterval(updateTimer, 100); // Update timer every 100ms
  startQuiz();
}

function populateCapitals() {
  const list = document.getElementById("capitals-list");
  list.innerHTML = "";
  for (const country in capitals) {
    const listItem = document.createElement("li");
    listItem.textContent = `${country}: ${capitals[country]}`;
    list.appendChild(listItem);
  }
}

function startLearn() {
  document.getElementById("learn-container").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  quizOrder = shuffle(Object.keys(capitals));
  correctAnswers = 0;
  incorrectAnswers = 0;
  currentQuestionIndex = 0;
  incorrectCapitals.clear();
  nextQuestion();
}

function startQuiz() {
  correctAnswers = 0;
  incorrectAnswers = 0;
  currentQuestionIndex = 0;
  incorrectCapitals.clear();
  nextQuestion();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateTimer() {
  const currentTime = new Date();
  const timeTaken = ((currentTime - startTime) / 1000).toFixed(2);
  document.getElementById("timer").textContent = `Zeit: ${timeTaken} Sekunden`;
}

function nextQuestion() {
  if (currentQuestionIndex < quizOrder.length) {
    const country = quizOrder[currentQuestionIndex];
    document.getElementById("question").textContent = `Wie heißt die Hauptstadt von ${country}?`;
    document.getElementById("answer").value = "";
    document.getElementById("result").textContent = "";
    document.getElementById("answer").focus();
    currentAttempts = 0;
  } else {
    if (learningMode && incorrectCapitals.size > 0) {
      quizOrder = Array.from(incorrectCapitals).map((item) => item.split(":")[0]);
      incorrectCapitals.clear();
      currentQuestionIndex = 0;
      nextQuestion();
    } else {
      endQuiz();
    }
  }
}

function checkAnswer() {
  const userAnswer = document.getElementById("answer").value.trim();
  const country = quizOrder[currentQuestionIndex];
  if (userAnswer.toLowerCase() === capitals[country].toLowerCase()) {
    correctAnswers++;
    if (currentAttempts > 0) {
      incorrectCapitals.delete(`${country}: ${capitals[country]}`);
    }
    currentQuestionIndex++;
    nextQuestion();
  } else {
    currentAttempts++;
    incorrectAnswers++;
    if (!learningMode) {
      incorrectCapitals.add(`${country}: ${capitals[country]}`);
    }
    if (showAnswerMode) {
      document.getElementById("result").innerHTML = `Falsch, die richtige Antwort ist <span class="incorrect">${capitals[country]}</span>.`;
    } else {
      document.getElementById("result").textContent = "Falsch, versuch es nochmal.";
    }
  }
}

function skipQuestion() {
  const country = quizOrder[currentQuestionIndex];
  incorrectCapitals.add(`${country}: ${capitals[country]}`);
  currentQuestionIndex++;
  nextQuestion();
}

function endQuiz() {
  if (competitiveMode) {
    clearInterval(timerInterval); // Stop the timer
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    const endTime = new Date(); // Stop timer
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Calculate time in seconds
    document.getElementById("final-time").textContent = `Gesamtzeit: ${timeTaken} Sekunden`;

    if (timeTaken < bestTime) {
      bestTime = timeTaken;
    }
    document.getElementById("best-time").textContent = `Beste Zeit: ${bestTime} Sekunden`;
  } else {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    const percentage = (correctAnswers / quizOrder.length) * 100;
    document.getElementById("final-result").textContent = `Du hast ${correctAnswers} von ${quizOrder.length} richtig beantwortet (${percentage.toFixed(2)}%). Fehler: ${incorrectAnswers}.`;

    const incorrectList = document.getElementById("incorrect-list");
    incorrectList.innerHTML = "";
    if (incorrectCapitals.size > 0) {
      const title = document.createElement("h3");
      title.textContent = "Falsch beantwortete Hauptstädte:";
      incorrectList.appendChild(title);

      const list = document.createElement("ul");
      Array.from(incorrectCapitals)
        .sort((a, b) => a.localeCompare(b))
        .forEach((capital) => {
          const listItem = document.createElement("li");
          listItem.textContent = capital;
          list.appendChild(listItem);
        });
      incorrectList.appendChild(list);
    } else {
      incorrectList.textContent = "Keine falsch beantworteten Hauptstädte!";
    }
  }
}

function restartQuiz() {
  document.getElementById("result-container").style.display = "none";
  document.getElementById("mode-selection").style.display = "block";
  document.getElementById("timer").style.display = "none";
  document.querySelector("#quiz-buttons button:nth-child(2)").style.display = "inline-block"; // Show skip button again
}

document.getElementById("answer").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  } else if (event.key === "Tab") {
    event.preventDefault();
    if (learningMode) {
      document.getElementById("result").innerHTML = `Die richtige Antwort ist <span class="incorrect">${capitals[quizOrder[currentQuestionIndex]]}</span>.`;
      skipQuestion();
    } else {
      skipQuestion();
    }
  }
});

window.onload = populateCapitals;
