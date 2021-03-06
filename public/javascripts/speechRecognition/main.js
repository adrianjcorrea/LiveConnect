class App {
  constructor () {
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.synth = window.speechSynthesis;
    this.icon = document.querySelector('i.fa.fa-microphone');
    this.paragraph = document.createElement('p');
    this.container = document.querySelector('.text-box');
    this.sound = document.querySelector('.sound');
    this.listening = false;
    this.question = false;
    this.appendParagraph();
    this.voices = [];
    this.initializeVoicePopulation();
    this.handleMicIconClick();
    this.watchRecognition();
    this.cachedWeather = false;

    this.pitch = document.querySelector('#pitch');
    this.pitchValue = document.querySelector('.pitch-value');
    this.rate = document.querySelector('#rate');
    this.rateValue = document.querySelector('.rate-value');
  }

  // this.pitch.onchange = function() {
  //   this.pitchValue.textContent = this.pitch.value;
  // }
  //
  // this.rate.onchange = function() {
  //   this.rateValue.textContent = this.rate.value;
  // }

  appendParagraph() {
    this.container.appendChild(this.paragraph);
  }

  populateVoiceList() {
    if(typeof speechSynthesis === 'undefined') {
      return;
    }

    this.voices = speechSynthesis.getVoices();
    let i;

    for(i = 0; i < this.voices.length ; i++) {
      let option = document.createElement('option');
      option.textContent = this.voices[i].name + ' (' + this.voices[i].lang + ')';

      if(this.voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', this.voices[i].lang);
      option.setAttribute('data-name', this.voices[i].name);
      document.getElementById("voiceSelect").appendChild(option);

      // if(this.voices[i].name !== 'Google UK English Male') {
      //   option.setAttribute('data-lang', this.voices[i].lang);
      //   option.setAttribute('data-name', this.voices[i].name);
      //   document.getElementById("voiceSelect").appendChild(option);
      // }
    }
    // voiceSelect.selectedIndex = selectedIndex;
  }

  initializeVoicePopulation() {
    this.populateVoiceList();
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.populateVoiceList;
    }
  }

  handleMicIconClick() {
    this.icon.addEventListener('click', () => {
      if (this.listening) {
        this.recognition.stop();
        return;
      }
      this.sound.play();
      this.dictate();
    });
  }

  watchRecognition() {
    this.recognition.onstart = function() {
      this.listening = true;
      console.log('Speech recognition service has started');
    };

    this.recognition.onend = function() {
      console.log('Speech recognition service disconnected');
    };
  }

  dictate() {
    console.log('dictating...');
    this.recognition.start();
    this.recognition.onresult = (event) => {
      const speechToText = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');

      this.paragraph.textContent = speechToText;

      if (event.results[0].isFinal) {
        this.container.scrollTo(0, this.container.scrollHeight);
        this.paragraph = document.createElement('p');
        this.appendParagraph();

        this.handleRequest(speechToText);
      }
    };
    // this.recognition.onend = this.recognition.start
  }

  setVoice(utterThis) {
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(var i = 0; i < this.voices.length ; i++) {
      if(this.voices[i].name === selectedOption) {
        utterThis.voice = this.voices[i];
      }
    }
  }

  speak(action) {
    var utterThis = new SpeechSynthesisUtterance(action());
    utterThis.pitch = this.pitch.value;
    utterThis.rate = this.rate.value;
    this.setVoice(utterThis);
    this.synth.speak(utterThis);
  }

  handleRequest(speech) {
    if (speech === 'commands') {
      this.speak(this.commands);
    }

    if (speech === 'command') {
      this.speak(this.commands);
    }

    if (speech === 'Rinoa') {
      this.speak(this.hello);
    }

    if (speech === 'hi') {
      this.speak(this.hello);
    }

    if (speech === 'hello') {
      this.speak(this.hello);
    }

    if (speech === 'what\'s up') {
      this.speak(this.hello);
    }

    if (speech.includes('what is the time')) {
      this.speak(this.getTime);
    }

    if (speech.includes('what time is it')) {
      this.speak(this.getTime);
    }

    if (speech.includes('what is today\'s date')) {
      this.speak(this.getDate);
    }

    if (speech.includes('today\'s date')) {
      this.speak(this.getDate);
    }

    if (speech === 'weather') {
      this.speak(this.getWeatherQuestion);
    }

    if (speech === 'what is the weather') {
      this.speak(this.getWeatherQuestion0);
    }

    if (speech.startsWith('weather in')) {
      this.getWeather(speech);
    }

    if (speech.includes('what is the weather in')) {
      this.getWeather0(speech);
    }

    if (speech.includes('what is your name')) {
      this.speak(this.getMyName);
    }

    if (speech.includes('what are you called')) {
      this.speak(this.getMyName);
    }

    if (speech.includes('who are you')) {
      this.speak(this.getMyName0);
    }

    if (speech.includes('what are you')) {
      this.speak(this.getMyName0);
    }

    if (speech.includes('open a website')) {
      const utterThis = new SpeechSynthesisUtterance('what URL do you want to open?');
      this.setVoice(utterThis);
      this.synth.speak(utterThis);
      this.recognition.abort();
      this.recognition.stop();
      this.question = true;
      return;
    }

    if (speech.includes('open the website')) {
      const utterThis = new SpeechSynthesisUtterance('what URL do you want to open?');
      this.setVoice(utterThis);
      this.synth.speak(utterThis);
      this.recognition.abort();
      this.recognition.stop();
      this.question = true;
      return;
    }

     // || 'open the website'|| 'open their website' || 'open my website'

    if (speech.includes('open a webpage')) {
      const utterThis = new SpeechSynthesisUtterance('what URL do you want to open?');
      this.setVoice(utterThis);
      this.synth.speak(utterThis);
      this.recognition.abort();
      this.recognition.stop();
      this.question = true;
      return;
    }

    if (speech.includes('open the webpage')) {
      const utterThis = new SpeechSynthesisUtterance('what URL do you want to open?');
      this.setVoice(utterThis);
      this.synth.speak(utterThis);
      this.recognition.abort();
      this.recognition.stop();
      this.question = true;
      return;
    }

     // || 'open the webpage'|| 'open their webpage' || 'open my webpage'

    if (speech.includes('open') && this.question) {
      // this.openUrl(speech.split(' ')[1]);

      // var speech0 = speech.split(' ');
      // var speech1 = speech0.slice(1);
      // var speech2 = speech1.split('');
      // console.log(speech2);

      var speech0 = speech.split('').slice(5);
      var speech1 = speech0.join('');
      var speech2 = speech1.split(' ');
      var speech3 = speech2.join('');
      console.log(speech3);
      this.openUrl(speech3);

      // var speechReduce = function (speech0) {
      //   var speech1 = '';
      //   var speech2 = '';
      //   for (var char in speech0) {
      //     speech2.concat(char);
      //   }
      //   console.log(speech2);
      //   this.openUrl(speech2);
      // }

      // this.openUrl(speech2);

      this.question = false;
    // } else {
    //   this.speak(this.hello);
    };
  }

  hello() {
    return `Hi. How can I help you? For a list of commands say, commands.`
  }

  commands() {
    return `I can tell you the weather, the time, or even open a website for you.`
  }

  getTime() {
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
  }

  getMyName0() {
    return `I am a speech recognition algorithm, and my name is Rinoa`;
  }

  getMyName() {
    return `my name is Rinoa`;
  }

  getDate() {
    const time = new Date(Date.now())
    return `today is ${time.toLocaleDateString()}`;
  }

  getWeatherQuestion() {
    return `If you want the weather, please specify from what city`;
  }

  getWeatherQuestion0() {
    return `Please specify from what city`;
  }

  getWeather(speech) {
    self = this;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[2]}&appid=6aa90859f3e957ff6c77ec9b1bc86296&units=metric`
    if ('caches' in window) {
      /*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       */
      caches.match(url).then(function(response) {
        if (response) {
          self.cachedWeather = true;
          response.json().then(function updateFromCache(json) {
            if (json.cod === '404') {
              const utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[2]}`);
              self.setVoice(utterThis);
              self.synth.speak(utterThis);
              return;
            }
            const utterThis = new SpeechSynthesisUtterance(`the weather condition in ${json.name} is mostly full of
            ${json.weather[0].description} at a temperature of ${json.main.temp} degrees Celcius`);
            self.setVoice(utterThis);
            self.synth.speak(utterThis);
          });
        }
      });
    }
    fetch(url)
    .then(function(response){
      return response.json();
    }).then(function(weather){
      if (self.cachedWeather) {
        return;
      }
      if (weather.cod === '404') {
        const utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[2]}`);
        self.setVoice(utterThis);
        self.synth.speak(utterThis);
        return;
      }
      const utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of
      ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
      self.setVoice(utterThis);
      self.synth.speak(utterThis);
    });
  }

  getWeather0(speech) {
    self = this;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=6aa90859f3e957ff6c77ec9b1bc86296&units=metric`
    if ('caches' in window) {
      /*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       */
      caches.match(url).then(function(response) {
        if (response) {
          self.cachedWeather = true;
          response.json().then(function updateFromCache(json) {
            if (json.cod === '404') {
              const utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
              self.setVoice(utterThis);
              self.synth.speak(utterThis);
              return;
            }
            const utterThis = new SpeechSynthesisUtterance(`the weather condition in ${json.name} is mostly full of
            ${json.weather[0].description} at a temperature of ${json.main.temp} degrees Celcius`);
            self.setVoice(utterThis);
            self.synth.speak(utterThis);
          });
        }
      });
    }
    fetch(url)
    .then(function(response){
      return response.json();
    }).then(function(weather){
      if (self.cachedWeather) {
        return;
      }
      if (weather.cod === '404') {
        const utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
        self.setVoice(utterThis);
        self.synth.speak(utterThis);
        return;
      }
      const utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of
      ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
      self.setVoice(utterThis);
      self.synth.speak(utterThis);
    });
  }

  openUrl(url) {
    window.open(`http://${url}`,'_newtab');
  }
}

const speechRec = new App();

// add service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./service-worker.js')
           .then(function() { console.log('Service Worker Registered'); });
}
