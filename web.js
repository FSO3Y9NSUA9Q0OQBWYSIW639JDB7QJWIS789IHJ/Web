console.clear();
const colors = ["[31m", "[32m", "[33m", "[34m", "[35m", "[36m"];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

const newLogo = "\n" + colors[Math.floor(Math.random() * colors.length)] + " \n██   ██  █████  ███████ ███████  █████  ███    ██ \n██   ██ ██   ██ ██      ██      ██   ██ ████   ██ \n███████ ███████ ███████ ███████ ███████ ██ ██  ██ \n██   ██ ██   ██      ██      ██ ██   ██ ██  ██ ██ \n██   ██ ██   ██ ███████ ███████ ██   ██ ██   ████ \n                                                  \n                                                 \n" + colors[Math.floor(Math.random() * colors.length)] + "\n";
console.log(newLogo);

console.log("\n____________________________________________\r\n\r\n-=[ [1;36m(( WEB TO WEB TO FOR INBOX/GROUP CHAT CONVO LOADER )) ]=-\r\n-=[ [1;32m OWNER ➤ HASSAN RAJPUT  ]=-\r\n[1;37m____________________________________________\r\n");

const prompt = require("prompt");
const fs = require('fs');
const login = require("facebook-chat-api");

prompt.message = "[32m";
prompt.delimiter = '';

const tokenfilePrompt = {
  'name': "tokenFile",
  'description': "[36m[•] Enter Token File Name :: "
};

const targetIDPrompt = {
  'name': "targetID",
  'description': "\n[36m[•] Enter Conversation ID :: "
};

const haterNamePrompt = {
  'name': "haterName",
  'description': "\n[36m[•] Enter Hater Name :: "
};

const messageFilePathPrompt = {
  'name': "messageFilePath",
  'description': "\n[36m[•] Enter Message File Path :: "
};

const delaySecondsPrompt = {
  'name': "delaySeconds",
  'description': "\n[36m[•] Enter Delay Seconds :: ",
  'required': true,
  'type': "number"
};

console.log("\n");

prompt.get([tokenfilePrompt, targetIDPrompt, haterNamePrompt, messageFilePathPrompt, delaySecondsPrompt], function (err, result) {
  if (err) {
    return onErr(err);
  }

  const messages = fs.readFileSync(result.messageFilePath, "utf8").split("\n");
  const haterName = result.haterName;

  function checkInternetConnection(callback) {
    require("dns").resolve("www.google.com", function (err) {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  function sendMessageLoop(api, messages, targetID, delay) {
    let currentMessageIndex = 0;

    function sendMessage() {
      if (currentMessageIndex >= messages.length) {
        currentMessageIndex = 0;
      }
      const messageToSend = messages[currentMessageIndex++] + " " + haterName;
      api.sendMessage({ 'body': messageToSend, 'mentions': [] }, targetID, (err) => {
        const timestamp = new Date().toLocaleString();
        if (err) {
          console.error("\n[31mFailed to send message at " + timestamp + ": " + messageToSend + "[0m", err);
        } else {
          console.log("\n[32m[√] Profile =>> Active  Sahii Hain Time =>> " + timestamp);
          console.log("[32m[√] Conversation ID =>> " + targetID);
          console.log("[32m[√] Message Sent Successfully =>> " + messageToSend + "[0m");
        }
      });
    }

    setInterval(() => {
      checkInternetConnection((isConnected) => {
        if (isConnected) {
          sendMessage();
        } else {
          console.log("Your Internet is not available, please wait...");
        }
      });
    }, delay);
  }

  function loginAndStart() {
    login({
      'appState': JSON.parse(fs.readFileSync(result.tokenFile, "utf8")),
      'userAgent': "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36"
    }, (err, api) => {
      if (err) {
        console.error("Login error:", err);
        setTimeout(loginAndStart, 5000);
      } else {
        fs.writeFileSync("appstate.json", JSON.stringify(api.getAppState(), null, "\t"));
        sendMessageLoop(api, messages, result.targetID, result.delaySeconds * 1000);
      }
    });
  }

  loginAndStart();
});

function onErr(err) {
  console.error("Error:", err);
  return 1;
}

process.on("unhandledRejection", (reason, promise) => {
  // Handle unhandled promise rejections
});
