const questionsData = {
    junior: [
        { question: "O que é um loop em programação?", answer: "Um bloco de código que é executado repetidamente." },
        { question: "Explique o conceito de array em JavaScript.", answer: "Uma coleção ordenada de valores." },
    ],
    intermediate: [
        { question: "O que é o DOM?", answer: "O Modelo de Objeto de Documento (DOM) é uma interface de programação para documentos HTML e XML." },
        { question: "Como funciona o 'hoisting' em JavaScript?", answer: "A elevação (hoisting) move as declarações para o topo do escopo." },
    ],
    senior: [
        { question: "O que são Promises em JavaScript?", answer: "Promises são objetos que representam o resultado de uma operação assíncrona." },
        { question: "Explique o conceito de closures.", answer: "Closures são funções que têm acesso a variáveis fora de seu próprio escopo." },
    ],
};

const levelForm = document.getElementById("levelForm");
const levelSubmitBtn = document.getElementById("levelSubmitBtn");
const questionsSection = document.getElementById("questions");
const submitBtn = document.getElementById("submitBtn");
const feedbackDiv = document.getElementById("feedback");

let selectedLevel = "";

const showQuestions = (level) => {
    levelForm.classList.add("hidden");
    questionsSection.classList.remove("hidden");
    submitBtn.classList.remove("hidden");

    questionsSection.innerHTML = ""; // Limpa as perguntas existentes

    questionsData[level].forEach((data, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `
            <div class="question">
                <p>${index + 1}. ${data.question}</p>
                <input type="text" id="answer${index}" placeholder="Sua resposta">
            </div>`;
        questionsSection.appendChild(questionDiv);
    });
};

levelSubmitBtn.addEventListener("click", () => {
    selectedLevel = document.getElementById("developerLevel").value;
    if (selectedLevel) {
        showQuestions(selectedLevel);
    }
});

submitBtn.addEventListener("click", async () => {
    const userAnswers = [];
    let isValid = true;

    questionsData[selectedLevel].forEach((data, index) => {
        const userAnswer = document.getElementById(`answer${index}`).value.trim();
        userAnswers.push({ question: data.question, userAnswer });

        // Verifica se há campos em branco
        if (userAnswer === "") {
            isValid = false;
            feedbackDiv.innerHTML = '<p>Preencha todos os campos.</p>';
        }
    });

    if (isValid) {
        try {
            const response = await fetch('/submit-answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers: userAnswers }),
            });

            const data = await response.json();
            feedbackDiv.innerHTML = `<p>${data.message}</p>`;
        } catch (error) {
            console.error('Erro ao enviar respostas:', error);
            feedbackDiv.innerHTML = '<p>Ocorreu um erro. Tente novamente.</p>';
        }
    }
});
