const addSourceScript = () => {
  const tag = document.createElement("script");
  tag.setAttribute(
    "src",
    "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"
  );

  document.head.appendChild(tag);
};

const __socketJoin = (partyId) => {
  const socket = io("https://sheltered-brook-94018.herokuapp.com");
  socket.on("connection-id", (cid) => {
    const connectionId = cid;
    console.log({ partyId });
    socket.emit("join-party", connectionId, partyId);
    socket.on("member-update", (data) => {
      console.log("member update");
      console.log({ data });
    });

    socket.on("join-party-fail", console.log);

    console.log({ connectionId });

    // setTimeout(() => {
    const video = document.querySelectorAll("video")[0];
    //   playPauseBtn.setAttribute("data-listen", "1");

    let allowToggle = true;
    video.addEventListener("play", function () {
      if (allowToggle) {
        socket.emit("play-req", partyId);
      } else {
        allowToggle = true;
      }
    });
    video.addEventListener("pause", function () {
      if (allowToggle) {
        socket.emit("pause-req", partyId);
      } else {
        allowToggle = true;
      }
    });

    video.addEventListener("seeked", function () {
      console.log("seeked");
      socket.emit("update-time-req", this.currentTime);
    });

    socket.on("play-action", () => {
      allowToggle = false;
      video.play();
    });
    socket.on("pause-action", () => {
      allowToggle = false;
      video.pause();
    });
    socket.on("update-time-action", (time) => {
      console.log({ time });
      video.pause();
      video.currentTime = time;
      video.play();
    });
    // }, 3000);
  });
};
const __socketCreate = () => {
  const socket = io("https://sheltered-brook-94018.herokuapp.com");
  socket.on("connection-id", (cid) => {
    const connectionId = cid;
    socket.emit("start-party", connectionId);
    socket.on("party-id", (pid) => {
      const partyId = pid;
      const shareUrl = `${window.location.href}?autoplay=1&t=0&partyId=${partyId}`;
      console.log({ partyId, shareUrl });

      window.location.href = shareUrl;
      const btn = document.getElementById("start-party-btn");
      const msg = document.createElement("div");
      msg.innerText = shareUrl;
      msg.classList.add("party-url--yt");
      btn.parentElement.insertBefore(msg, btn);
    });

    console.log({ connectionId });
  });
};
const addHandlerScript = (fn, args = []) => {
  const tag = document.createElement("script");
  tag.innerHTML = `(${fn.toString()})("${args.join(`","`)}")`;
  document.head.appendChild(tag);
};

const getURLParams = () => {
  const { href } = window.location;
  if (!href.split("?")[1]) {
    return false;
  }
  return href
    .split("?")[1]
    .split("&")
    .reduce((combined, pair) => {
      const [key, val] = pair.split("=");
      combined[key] = val;
      return combined;
    }, {});
};

const addButtonToPage = () => {
  const btn = document.createElement("button");
  btn.innerText = "Start Watch Party";
  btn.classList.add("start-party--yt");
  btn.setAttribute("id", "start-party-btn");
  console.log("adding btn");
  document.body.prepend(btn);

  btn.addEventListener("click", () => addHandlerScript(__socketCreate));
};

const handler = () => {
  console.log(getURLParams());
  const { partyId } = getURLParams();
  if (partyId) {
    console.log("joining video party");
    addSourceScript();
    setTimeout(() => addHandlerScript(__socketJoin, [partyId]), 1000);
  } else {
    console.log("video id exists");
    addSourceScript();
    addButtonToPage();
  }
};

setTimeout(handler, 1000);
