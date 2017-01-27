//Nuance Module
window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();

var NuanceFlow = (function() {
    var closeCall  = document.getElementById('close-mic');
    var messageEndpoint = '/api/nuance-text-to-speech/';
    var audioNuance = null; // Initialize audio to null
    var button = document.getElementById('output-audio');
    var source; // Create Sound Source
    var mic  = document.getElementById('input-mic');

    return {
      init: init,
      NuanceTTS: NuanceTTS,
      play:play,
      stopsNuance:stopsNuance,
      endCall: endCall,
      updateAudio:updateAudio
    };

  function init(){
        console.log("Iniciando enlace");
        closeCall.setAttribute('class', 'active-close'); 
     }
  
   function updateAudio(){
       button.value = 'ON';
   }
   //function that stops Nuance streaming
   function stopsNuance(){
    source.stop(0); 
   } 

  //function that ends  the call, stopping continue streaming.
   function endCall(){
    source.stop(0); 
    button.value = 'OFF';
    closeCall.setAttribute('class', 'active-close'); 
    mic.setAttribute('class', 'inactive-mic');  // Reset our microphone button to visually indicate we aren't listening to user anymore
   STTModule.off();
   }

  function NuanceTTS(text,voice,variant) {
      //Sends a TTS (text-to-speech) request to Nuance.
    //var data = {'input': {'text': text}};

    var http = new XMLHttpRequest();
    var msn = text.replace("?","");
    http.open('GET', messageEndpoint + msn + "?voice=" + voice + "&varnt=" + variant, true);
    http.responseType = "arraybuffer"; 
    http.setRequestHeader('Content-type', 'html/plain');
    http.onerror = function() {
      console.error('Network error trying to send message!');
    };
      http.onload = function() {
      var Data = http.response;
      process(Data);
    };
     http.send(null);
  }

//function that plays audio from specific path
  function play(audioToReproduce){
   var audio = document.getElementById('audioNuance');
   audio.setAttribute('src',audioToReproduce);
   audio.play();
                 }
//function that plays the file retrieved  by the get request.
function process(Data) {
  if( button.value == 'ON' ){
  source = context.createBufferSource(); // Create Sound Source
  context.decodeAudioData(Data, function(buffer){
    source.buffer = buffer;
    source.connect(context.destination); 
    source.start(context.currentTime);
  });
   source.onended = function() { //el audio a finalizado
   console.log('Your audio has finished playing');
   STTModule.speechToText();  
}
  }
   console.log('Your audio it is mute');
};

}());

 