const recordBtn = document.querySelector(".record"),
  result = document.querySelector("#result1"),
  sumResult = document.querySelector("#result2"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear"),
  copyBtn=document.querySelector(".copy"),
  copySumBtn=document.querySelector(".copySum"),
  icon=document.getElementById("dark-mode");

let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;

function populateLanguages() {
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}

populateLanguages();

function speechToText() {
  try {
    recognition = new SpeechRecognition();
    recognition.lang = inputLanguage.value;
    recognition.interimResults = true;
    recordBtn.classList.add("recording");
    recordBtn.querySelector("p").innerHTML = "Listening...";
    recognition.start();
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      //detect when intrim results
      if (event.results[0].isFinal) {
        result.innerHTML += " " + speechResult;
      } 
      downloadBtn.disabled = false;
      copyBtn.disabled = false;
      copySumBtn.disabled = false;
    };
    recognition.onspeechend = () => {
      speechToText();
    };
    recognition.onerror = (event) => {
      stopRecording();
      if (event.error === "no-speech") {
        alert("No speech was detected. Stopping...");
      } else if (event.error === "audio-capture") {
        alert(
          "No microphone was found. Ensure that a microphone is installed."
        );
      } else if (event.error === "not-allowed") {
        alert("Permission to use microphone is blocked.");
      } else if (event.error === "aborted") {
        alert("Listening Stopped.");
      } else {
        alert("Error occurred in recognition: " + event.error);
      }
    };
  } catch (error) {
    recording = false;

    console.log(error);
  }
}

recordBtn.addEventListener("click", () => {
  if (!recording) {
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }
  result.innerHTML=result.innerHTML.replace(/full stop/g,".");
});

function stopRecording() {
  recognition.stop();
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

function download() {
  const text = result.innerHTML;
  const summ = sumResult.innerHTML;
  const finalText = text.concat("\n\n",summ);
  const filename = "speech.txt";

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(finalText)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function copy(){
    var copyText = result.innerHTML;
    navigator.clipboard.writeText(copyText);
    alert("Copied the text");
}

function copySum(){
  var copyText = sumResult.innerHTML;
  navigator.clipboard.writeText(copyText);
  alert("Copied the summary");
}

downloadBtn.addEventListener("click", download);
copyBtn.addEventListener("click",copy);
copySumBtn.addEventListener("click",copySum);

clearBtn.addEventListener("click", () => {
  result.innerHTML = "";
  sumResult.innerHTML = "";
  downloadBtn.disabled = true;
  copyBtn.disabled=true;
  copySumBtn.disabled = true;
});

icon.addEventListener("click", () =>{
  document.body.classList.toggle("darkmode");
  if(document.body.classList.contains("darkmode")){
    icon.src="../static/sun.png";
  }
  else{
    icon.src="../static/moon.png";
  }
});
