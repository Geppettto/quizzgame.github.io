const districts = [
    "Innere Stadt",
    "Leopoldstadt",
    "Landstraße",
    "Wieden",
    "Margareten",
    "Mariahilf",
    "Neubau",
    "Josefstadt",
    "Alsergrund",
    "Favoriten",
    "Simmering",
    "Meidling",
    "Hietzing",
    "Penzing",
    "Rudolfsheim-Fünfhaus",
    "Ottakring",
    "Hernals",
    "Währing",
    "Döbling",
    "Brigittenau",
    "Floridsdorf",
    "Donaustadt",
    "Liesing",
  ];

  let quizOrder = [];
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let currentQuestionIndex = 0;
  let currentAttempts = 0;
  let incorrectDistricts = new Set();
  let showAnswerMode = false;
  let competitiveMode = false;
  let learningMode = false;
  let startTime, timerInterval;
  let bestTime = Infinity;

  function showHome() {
    document.getElementById("mode-selection").style.display = "block";
    document.getElementById("competitive-selection").style.display = "none";
    document.getElementById("learn-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "none";
    document.getElementById("timer").style.display = "none";
    document.querySelector(
      "#quiz-buttons button:nth-child(2)"
    ).style.display = "inline-block";
  }

  function selectMode(mode) {
    showAnswerMode = mode === "show-answer";
    competitiveMode = mode === "competitive";
    learningMode = mode === "show-answer";
    document.getElementById("mode-selection").style.display = "none";
    if (competitiveMode) {
      document.getElementById("competitive-selection").style.display =
        "block";
    } else {
      document.getElementById("learn-container").style.display = "block";
      populateDistricts();
    }
  }

  function startCompetitive(level) {
    document.getElementById("competitive-selection").style.display = "none";
    document.getElementById("learn-container").style.display = "block";
    document.getElementById("timer").style.display = "block";
    document.querySelector(
      "#quiz-buttons button:nth-child(2)"
    ).style.display = "none"; // Hide skip button in competitive mode
    if (level === "easy") {
      quizOrder = [...Array(districts.length).keys()];
    } else {
      quizOrder = shuffle([...Array(districts.length).keys()]);
    }
    startTime = new Date(); // Start timer
    timerInterval = setInterval(updateTimer, 100); // Update timer every 100ms
    startQuiz();
  }

  function populateDistricts() {
    const list = document.getElementById("districts-list");
    list.innerHTML = "";
    districts.forEach((district) => {
      const listItem = document.createElement("li");
      listItem.textContent = district;
      list.appendChild(listItem);
    });
  }

  function startLearn() {
    document.getElementById("learn-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    quizOrder = shuffle([...Array(districts.length).keys()]);
    correctAnswers = 0;
    incorrectAnswers = 0;
    currentQuestionIndex = 0;
    incorrectDistricts.clear();
    nextQuestion();
  }

  function startQuiz() {
    document.getElementById("learn-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    correctAnswers = 0;
    incorrectAnswers = 0;
    currentQuestionIndex = 0;
    incorrectDistricts.clear();
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
    document.getElementById(
      "timer"
    ).textContent = `Zeit: ${timeTaken} Sekunden`;
  }

  function nextQuestion() {
    if (currentQuestionIndex < quizOrder.length) {
      const districtIndex = quizOrder[currentQuestionIndex];
      document.getElementById("question").textContent = `Wie heißt Bezirk ${
        districtIndex + 1
      }?`;
      document.getElementById("answer").value = "";
      document.getElementById("result").textContent = "";
      document.getElementById("answer").focus();
      currentAttempts = 0;
    } else {
      if (learningMode && incorrectDistricts.size > 0) {
        quizOrder = Array.from(incorrectDistricts).map(
          (item) => parseInt(item.split(":")[0]) - 1
        );
        incorrectDistricts.clear();
        currentQuestionIndex = 0;
        nextQuestion();
      } else {
        endQuiz();
      }
    }
  }

  function checkAnswer() {
    const userAnswer = document.getElementById("answer").value.trim();
    const districtIndex = quizOrder[currentQuestionIndex];
    if (
      userAnswer.toLowerCase() === districts[districtIndex].toLowerCase()
    ) {
      correctAnswers++;
      if (currentAttempts > 0) {
        incorrectDistricts.delete(
          `${districtIndex + 1}: ${districts[districtIndex]}`
        );
      }
      currentQuestionIndex++;
      nextQuestion();
    } else {
      currentAttempts++;
      incorrectAnswers++;
      if (!learningMode) {
        incorrectDistricts.add(
          `${districtIndex + 1}: ${districts[districtIndex]}`
        );
      }
      if (showAnswerMode) {
        document.getElementById(
          "result"
        ).innerHTML = `Falsch, die richtige Antwort ist <span class="incorrect">${districts[districtIndex]}</span>.`;
      } else {
        document.getElementById("result").textContent =
          "Falsch, versuch es nochmal.";
      }
    }
  }

  function skipQuestion() {
    const districtIndex = quizOrder[currentQuestionIndex];
    incorrectDistricts.add(
      `${districtIndex + 1}: ${districts[districtIndex]}`
    );
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
      document.getElementById(
        "final-time"
      ).textContent = `Gesamtzeit: ${timeTaken} Sekunden`;

      if (timeTaken < bestTime) {
        bestTime = timeTaken;
      }
      document.getElementById(
        "best-time"
      ).textContent = `Beste Zeit: ${bestTime} Sekunden`;
    } else {
      document.getElementById("quiz-container").style.display = "none";
      document.getElementById("result-container").style.display = "block";
      const percentage = (correctAnswers / districts.length) * 100;
      document.getElementById(
        "final-result"
      ).textContent = `Du hast ${correctAnswers} von ${
        districts.length
      } richtig beantwortet (${percentage.toFixed(
        2
      )}%). Fehler: ${incorrectAnswers}.`;

      const incorrectList = document.getElementById("incorrect-list");
      incorrectList.innerHTML = "";
      if (incorrectDistricts.size > 0) {
        const title = document.createElement("h3");
        title.textContent = "Falsch beantwortete Bezirke:";
        incorrectList.appendChild(title);

        const list = document.createElement("ul");
        Array.from(incorrectDistricts)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .forEach((district) => {
            const listItem = document.createElement("li");
            listItem.textContent = district;
            list.appendChild(listItem);
          });
        incorrectList.appendChild(list);
      } else {
        incorrectList.textContent = "Keine falsch beantworteten Bezirke!";
      }
    }
  }

  function restartQuiz() {
    document.getElementById("result-container").style.display = "none";
    document.getElementById("mode-selection").style.display = "block";
    document.getElementById("timer").style.display = "none";
    document.querySelector(
      "#quiz-buttons button:nth-child(2)"
    ).style.display = "inline-block"; // Show skip button again
  }

  document
    .getElementById("answer")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        checkAnswer();
      } else if (event.key === "Tab") {
        event.preventDefault();
        if (learningMode) {
          document.getElementById(
            "result"
          ).innerHTML = `Die richtige Antwort ist <span class="incorrect">${
            districts[quizOrder[currentQuestionIndex]]
          }</span>.`;
          skipQuestion();
        } else {
          skipQuestion();
        }
      }
    });

  window.onload = populateDistricts;