var ss = SpreadsheetApp.openById("13naoY3wnZlnSTt7weDMXdF6Pu5eDbDdgfqUU9eANXog");
var sheet;

function getSheet() {
  sheet = ss.getSheetByName("Quiz Results");
  if (!sheet) {
    sheet = ss.insertSheet("Quiz Results");
    sheet.appendRow(["Name", "Answers", "Score"]);
  }
}

function doGet() {
  getSheet();
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Interactive Quiz')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getQuestions() {
  getSheet();
  var questions = [
    {
      question: "How many extensions can a developer publish?",
      options: ["5 extensions", "10 extensions", "20 extensions", "Unlimited extensions"],
      correctAnswer: "20 extensions"
    },
    {
      question: "Can a developer delete an extension once published?",
      options: ["Yes", "No"],
      correctAnswer: "No"
    },
    {
      question: "What is the maximum character limit for the plain text description string in the extension manifest?",
      options: ["100 characters", "120 characters", "132 characters", "150 characters"],
      correctAnswer: "132 characters"
    },
    {
      question: "How long does it typically take to complete the review process for an extension?",
      options: ["Up to 7 days", "Up to 14 days", "Up to 30 days", "Up to 60 days"],
      correctAnswer: "Up to 30 days"
    },
    {
      question: "Is there any alternative way to create a report based on your Google Analytics data?",
      options: ["No", "Yes"],
      correctAnswer: "Yes"
    }
  ];
  
  return questions;
}

function evaluateQuizResponses(responses, name) {
  getSheet();
  var questions = getQuestions();
  var score = 0;
  console.log("Received responses:", responses);
  for (var i = 0; i < questions.length; i++) {
    console.log(`Question ${i + 1}: User answer: "${responses[i]}", Correct answer: "${questions[i].correctAnswer}"`);
    if (responses[i] === questions[i].correctAnswer) {
      score++;
    }
  }
  saveQuizResults(name, responses.join(', '), score);
  return score;
}

function saveQuizResults(name, answers, score) {
  getSheet();
  sheet.appendRow([name, answers, score]);
}

function getTopPerformers() {
  getSheet();
  var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3);
  var data = dataRange.getValues();
  data.sort(function(a, b) {
    return b[2] - a[2];
  });
  return data.slice(0, 10); // Return top 5 performers
}

function getAnswers(name) {
  getSheet();
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === name) {
      return data[i][1];
    }
  }
  
  return "Answers not found";
}
