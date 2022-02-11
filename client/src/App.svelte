<script>
  import Request from "./lib/components/Request.svelte";

  const BASE_URL = "api.transparent.ga";
  const HTTP_URL = "https://" + BASE_URL;
  const socket = new WebSocket("wss://" + BASE_URL);
  const id = Math.random().toString(36).substring(7);

  let requests = [];
  let totalClients = 0;
  let connectionState = "Disconnected";
  let connectionStateClass = "text-danger";

  socket.onopen = () => (
    (connectionState = "Connected"), (connectionStateClass = "text-success")
  );

  socket.onclose = () => (
    (connectionState = "Disconnected"), (connectionStateClass = "text-danger")
  );

  socket.onmessage = (message) => {
    const { event, data } = JSON.parse(message.data);
    if (event === "new-client") {
      totalClients = data.totalClients;
    } else if (event === "http-request") {
      // insert at the beginning & limit to 10 elements (for performance)
      requests = [data, ...requests.slice(0, 9)];
    }
  };

  const sendRequest = () => {
    fetch(HTTP_URL + `/try/${id}/${Date.now()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello from the client!" }),
    }).catch(console.error);
  };

  setTimeout(() => fetch(HTTP_URL + "/ping").catch(console.error), 1000);
</script>

<main>
  <div class="m-3">
    <h1 class="dispaly-1">Transparent</h1>
    <div class="mt-3 fs-4">
      <p class="text-muted text-end position-absolute top-0 end-0 p-2">
        Total connected clients: <span>{totalClients}</span>
        <br />
        <span class={connectionStateClass}>{connectionState}</span>
      </p>
      <p>
        Transparent shows you a public log of the HTTP requests received on
        <a target="_blank" href={HTTP_URL}>{HTTP_URL}</a>
      </p>
      <div class="text-end">
        <button class="btn btn-outline-primary fs-5" on:click={sendRequest}
          >Try</button
        >
      </div>
      <div class="text-start">
        {#each requests as req}
          <Request {req} />
        {/each}
      </div>
    </div>
  </div>
</main>
