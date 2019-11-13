if (window.Worker) {
  console.log("Loading worker");
  const myWorker = new Worker("./worker.js");

  myWorker.postMessage({ type: "REQUEST_CONNECT" });

  myWorker.onmessage = function(m) {
    switch (m.data.type) {
      case "REQUEST_CONNECT_FAIL": {
        console.log("Failed to connect.");
      }
      case "DATA": {
        console.log(m.data);
      }
    }
  };
} else {
  console.log("Your browser doesn't support web workers.");
}
