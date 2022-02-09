const uWS = require("uWebSockets.js");
const { parseBody } = require("./utils");

const port = process.env.PORT || 5000;
const TOPIC_NAME = "requests";

const subscribers = () =>
  JSON.stringify({
    event: "new-client",
    data: { totalClients: app.numSubscribers(TOPIC_NAME) },
  });

const notify = (d, res) =>
  new Promise(async (resolve) => {
    const body = await parseBody(res);
    const data = {
      event: "http-request",
      data: { ...d, body },
    };
    app.publish(TOPIC_NAME, JSON.stringify(data));
    resolve();
  });

const app = uWS
  .App()
  .ws("/*", {
    open: (ws) => {
      ws.subscribe(TOPIC_NAME);
      app.publish(TOPIC_NAME, subscribers());
    },
    close: () => setTimeout(() => app.publish(TOPIC_NAME, subscribers()), 100),
  })
  .any("/*", (res, req) => {
    const headers = {};
    req.forEach((k, v) => (headers[k] = v));
    notify(
      {
        url: req.getUrl(),
        query: req.getQuery(),
        method: req.getMethod().toUpperCase(),
        headers,
      },
      res
    );

    // CORS headers
    res
      .writeStatus("204")
      .writeHeader("Access-Control-Allow-Origin", "*")
      .writeHeader("Access-Control-Allow-Methods", "*")
      .writeHeader("Access-Control-Allow-Headers", "*")
      .writeHeader("Access-Control-Expose-Headers", "*")
      .end();
  })
  .listen("0.0.0.0", port, (token) => {
    if (token) {
      console.log("Listening to port " + port);
    } else {
      console.log("Failed to listen to port " + port);
    }
  });
