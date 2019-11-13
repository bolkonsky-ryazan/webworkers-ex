onmessage = m => {
  switch (m.data.type) {
    case "REQUEST_CONNECT": {
      console.log("Connecting to local server...");
      // open connection to local node server
      ws = new WebSocket("ws://localhost:9999");

      ws.addEventListener("error", () => {
        postMessage({ type: "REQUEST_CONNECT_FAIL" });
      });

      ws.addEventListener("open", () => {
        console.log("Successfully connected.");
        postMessage({ type: "REQUEST_CONNECT_SUCCESS" });

        // when we get a message, just send it to the main thread
        ws.addEventListener("message", event => {
          const payload = processData(JSON.parse(event.data));
          postMessage({ type: "DATA", payload });
        });
      });
      break;
    }
  }
};

const processData = data => {
  const { first: firstRaw, second: secondRaw } = data;

  const first = Object.values(firstRaw).sort((a, b) => b.price - a.price);
  const second = Object.values(secondRaw).sort((a, b) => a.price - b.price);

  first.forEach((el, i) => {
    if (i === 0) {
      el.cumulAmount = el.amount;
      el.cumulCount = el.count;
    } else {
      el.cumulAmount = el.amount + first[i - 1].cumulAmount;
      el.cumulCount = el.count + first[i - 1].cumulCount;
    }
  });

  second.forEach((el, i) => {
    if (i === 0) {
      el.cumulAmount = el.amount;
      el.cumulCount = el.count;
    } else {
      el.cumulAmount = el.amount + second[i - 1].cumulAmount;
      el.cumulCount = el.count + second[i - 1].cumulCount;
    }
  });

  return { first, second };
};
