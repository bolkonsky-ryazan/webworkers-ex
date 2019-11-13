const WebSocket = require("ws");
const jStat = require("jstat");

const wss = new WebSocket.Server({ port: 9999 });

const INITIAL_VALUE = 1000;
const SEND_INTERVAL_MS = 50;
const DATA_LENGTH = 3000;

wss.on("connection", function connection(ws) {
  ws.on("close", () => {
    clearInterval(interval);
  });

  const data = dataIterator();

  console.log("New connection");
  const interval = setInterval(() => {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data.next()));
      }
    });
  }, SEND_INTERVAL_MS);
});

const dataIterator = (initialValue = INITIAL_VALUE) => ({
  next() {
    let bidSum = initialValue;
    let askSum = initialValue;

    const first = {};
    const second = {};

    const firstValues = [...new Array(DATA_LENGTH)].map(
      () => (bidSum -= jStat.normal.sample(0.5, 1))
    );
    const secondValues = [...new Array(DATA_LENGTH)].map(
      () => (askSum += jStat.normal.sample(0.5, 1))
    );

    firstValues.forEach(fv => {
      const value = fv;
      first[value] = {
        value,
        amount: Math.floor(Math.random() * 1000),
        count: Math.floor(Math.random() * 1000)
      };
    });

    secondValues.forEach(sv => {
      const value = sv;
      second[value] = {
        value,
        amount: Math.floor(Math.random() * 1000),
        count: Math.floor(Math.random() * 1000)
      };
    });

    return { first, second };
  }
});
