navigator.mediaDevices.getUserMedia({
  audio: true
}).then(function (audioStream) {
  const BUTTON_STATES = {
    start: 'record',
    loop: 'loop',
    end: 'stop',
  };

  let loopCount = 0;
  let loopAudio = [];

  const loopRecorder = new MediaRecorder(audioStream);

  const button = document.getElementById('control-button');
  const player = document.getElementById('player');

  player.onended = loopEnd;
  loopRecorder.onstop = playLoop;

  loopRecorder.addEventListener('dataavailable', function (evt) {
    loopAudio.push(evt.data);
  });

  button.addEventListener('click', function (ev) {
    if (loopRecorder.state === 'inactive') {
      startLoopRecorder();
      updateButtonText(BUTTON_STATES.loop);
    } else if (player.currentTime === 0) {
      loopEnd()
      updateButtonText(BUTTON_STATES.end);
    } else {
      resetPlayer();
    }
  });

  function updateButtonText(buttonText) {
    button.innerText = buttonText;
  }

  function updateLoopCount(count) {
    loopCount = count;
    const text = 'Loop Count: ' + count;
    document.getElementById('loop-count').innerText = text;
  }

  function resetPlayer() {
    updateLoopCount(0);
    player.pause();
    player.currentTime = 0;
    player.src = '';

    loopRecorder.stop();
    updateButtonText(BUTTON_STATES.start);
  }

  function startLoopRecorder() {
    loopAudio.length = 0;
    loopRecorder.start();
  }

  function playLoop() {
    if (loopCount === 0) {
      // piece has been stopped altogether;
      return;
    }

    player.src = window.URL.createObjectURL(
      new Blob(
        loopAudio,
        { 'type': 'audio/wav;' },
      )
    );

    startLoopRecorder();
    player.play();
  }

  function loopEnd() {
    updateLoopCount(loopCount + 1);
    loopRecorder.stop();
  }
});
