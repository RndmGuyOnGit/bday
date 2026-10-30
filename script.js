
/* =================================
   ✨ PERSONALIZE YOUR WEBSITE HERE
================================= */

const SETTINGS = {
  friendName: "Laren",

  letter: `Wassupp Laren,

Happy Birthday!! 🎉

I hope your day is filled with happiness,
laughter, and all the things you love.
Thank you for being a great friend and 
one hell of a sister. I am so glad to have
u as a friend. I hope ur day has been goin
great so far and i hope all ur wishes come
true. Hopefully i'll be there on ur next
birthday to celebrate with u, however i
still tried to make something special.
To more memories, more adventures,
and many more birthdays together sis!

,
 🎃`,

  photos: [
    {
      file: "images/photo1.jpg",
      caption: "A favourite memory 🧡"
    },
    {
      file: "images/photo2.jpg",
      caption: "One for the memories ✨"
    },
    {
      file: "images/photo3.jpg",
      caption: "More adventures to come 👻"
    }
  ]
};


/* =================================
   WEBSITE INTERACTIONS
================================= */

const $ = (selector) => document.querySelector(selector);

const party = $("#party");
const roomContent = $("#roomContent");
const roomBody = $("#roomBody");

let discovered = new Set();
let audioContext = null;
let musicPlaying = false;
let musicTimer = null;

function updateProgress() {
  $("#progress").textContent = discovered.size;
}

function discover(room) {
  discovered.add(room);
  updateProgress();
}

function enterParty() {
  $(".welcome").classList.add("hidden");
  party.classList.remove("hidden");
  party.scrollIntoView({ behavior: "smooth" });
}

$("#enterBtn").addEventListener("click", enterParty);

document.querySelectorAll("[data-room]").forEach(button => {
  button.addEventListener("click", () => {
    openRoom(button.dataset.room);
  });
});

$("#backBtn").addEventListener("click", () => {
  roomContent.classList.add("hidden");
  party.scrollIntoView({ behavior: "smooth" });
});


/* =================================
   ROOM SYSTEM
================================= */

function openRoom(room) {
  roomContent.classList.remove("hidden");

  if (room === "memories") showMemories();
  if (room === "letter") showLetter();
  if (room === "mystery") showMystery();
  if (room === "cake") showCake();
  if (room === "secret") showSecret();

  roomContent.scrollIntoView({ behavior: "smooth" });
}


/* =================================
   📸 MEMORY ATTIC
================================= */

function showMemories() {
  discover("memories");

  const photos = SETTINGS.photos.map(photo => `
    <div>
      <img
        src="${photo.file}"
        alt="${photo.caption}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
      >
      <p style="display:none">Add your photo at:<br>${photo.file}</p>
      <p>${photo.caption}</p>
    </div>
  `).join("");

  roomBody.innerHTML = `
    <h2>📸 The Memory Attic</h2>
    <p>A little gallery of special moments!</p>
    <div class="memory-gallery">
      ${photos}
    </div>
  `;
}


/* =================================
   📖 SPELL BOOK
================================= */

function showLetter() {
  discover("letter");

  roomBody.innerHTML = `
    <h2>📖 A Magical Birthday Message</h2>
    <div class="letter">${escapeHTML(SETTINGS.letter)}</div>
    <p class="sparkle">✨ A little reminder that its ur birthday broskii ✨</p>
  `;
}

function escapeHTML(text) {
  const element = document.createElement("div");
  element.textContent = text;
  return element.innerHTML;
}


/* =================================
   🔮 MYSTERY ROOM
================================= */

function showMystery() {
  roomBody.innerHTML = `
    <h2>🔮 Choose your mystery box!</h2>
    <p>Each box contains a little birthday surprise.</p>

    <div class="mystery-boxes">
      <button data-box="0">🎁</button>
      <button data-box="1">🎃</button>
      <button data-box="2">👻</button>
    </div>

    <p id="mysteryResult" class="secret-message"></p>
  `;

  const surprises = [
    "You are HER! ☀️",
    "Officially the coolest birthday witch! 🧙‍♀️",
    "The Diva Herself! 🧡"
  ];

  roomBody.querySelectorAll("[data-box]").forEach(button => {
    button.addEventListener("click", () => {
      $("#mysteryResult").textContent =
        surprises[Number(button.dataset.box)];

      discover("mystery");
    });
  });
}


/* =================================
   🎂 CAKE CHAMBER
================================= */

function showCake() {
  roomBody.innerHTML = `
    <h2>🎂 Make a Birthday Wish!</h2>
    <p>Click the cake to blow out the imaginary candles!</p>

    <div class="cake" id="cake">🎂</div>

    <p id="cakeMessage" class="secret-message">
      Make a wish... ✨
    </p>
  `;

  $("#cake").addEventListener("click", () => {
    $("#cake").textContent = "🍰";
    $("#cakeMessage").textContent =
      "Your wish has been sent to the universe! 🌟";

    discover("cake");
  });
}


/* =================================
   🎁 SECRET CHAMBER
================================= */

function showSecret() {
  roomBody.innerHTML = `
    <h2>🎁 The Secret Chamber</h2>
    <p>You've found a mysterious gift ma broski...</p>
    <button id="revealGift">OPEN YOUR GIFT BROSKI ✨</button>
    <div id="giftMessage"></div>
  `;

  $("#revealGift").addEventListener("click", () => {
    $("#giftMessage").innerHTML = `
      <h1 class="sparkle">🎉 HAPPY BIRTHDAY BROSKI! 🎉</h1>
      <p class="secret-message">
        ${escapeHTML(SETTINGS.friendName)},

        Its ur birthday lil nigga 🎉👻
      </p>
      <div style="font-size:3rem">🎃 💜 🎂 🦇</div>
    `;

    discover("secret");
  });
}


/* =================================
   🎵 SPOOKY BACKGROUND MUSIC
   Original music made with Web Audio
================================= */

async function toggleMusic() {
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      alert("Your browser doesn't support background music.");
      return;
    }

    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (musicPlaying) {
    clearInterval(musicTimer);
    musicPlaying = false;
    $("#musicBtn").textContent = "♫ Play spooky music";
    return;
  }

  musicPlaying = true;
  $("#musicBtn").textContent = "♫ Stop spooky music";

  const notes = [220, 261.63, 293.66, 349.23, 293.66, 261.63];
  let index = 0;

  function playNote() {
    if (!musicPlaying) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = notes[index % notes.length];

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.07, audioContext.currentTime + 0.08
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001, audioContext.currentTime + 0.65
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.7);

    index++;
  }

  playNote();
  musicTimer = setInterval(playNote, 700);
}

$("#musicBtn").addEventListener("click", toggleMusic);


/* =================================
   PERSONALIZE THE NAME
================================= */

document.querySelectorAll(".friend-name").forEach(element => {
  element.textContent = SETTINGS.friendName;
});
