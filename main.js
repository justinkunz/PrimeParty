const socket = io("http://localhost:5000");
chrome.extension.connect();
let connectionId;
let partyId;
socket.on("connection-id", (cid) => {
  connectionId = cid;
});

document.getElementById("startParty").addEventListener("click", () => {
  socket.emit("start-party");
  socket.on("party-id", (pid) => {
    partyId = pid;
    console.log({ partyId });
  });
});
