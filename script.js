navigator.mediaDevices.getUserMedia({
  audio: true
}).then(function (mediaStream) {
  const BUTTON_STATES = {
    start: 'record',
    loop: 'loop',
    end: 'end piece',
  };

  let loopCount = 0;
  const recorder = new MediaRecorder(mediaStream);
  const buffer = [];
  const button = document.getElementById('control-button');
  const player = document.getElementById('player');

  player.onended = loopEnd;
  recorder.onstop = playLoop;

  recorder.ondataavailable = function (evt) {
    buffer.push(evt.data);
  }

  button.addEventListener('click', function (ev) {
    if (recorder.state === 'inactive') {
      startRecorder();
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

    recorder.stop();
    updateButtonText(BUTTON_STATES.start);
  }

  function startRecorder() {
    buffer.length = 0;

    // is this necessary?
    if (recorder.state !== 'recording') {
      recorder.start();
    }
  }

  function playLoop() {
    if (loopCount === 0) {
      // piece has been stopped altogether;
      return;
    }

    player.src = window.URL.createObjectURL(
      new Blob(
        buffer,
        { 'type': 'audio/wav;' },
      )
    );

    player.currentTime = 0;
    player.play();
    startRecorder();
  }

  function loopEnd() {
    updateLoopCount(loopCount + 1);
    recorder.stop();
  }
});
