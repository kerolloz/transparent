<script>
  export let req;
</script>

<div class="shadow-lg p-3 m-5 bg-body rounded position-relative">
  <span
    class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-primary fs-6"
  >
    {req.method}
  </span>
  <span class="fw-light">{req.url}</span>

  {#if req.body}
    <details class="fs-5">
      <summary>Body</summary>
      <p class="text-start font-monospace fs-5">{req.body}</p>
    </details>
  {/if}

  {#if Object.keys(req.headers).length}
    <details class="fs-5">
      <summary>Headers</summary>
      {#each Object.entries(req.headers) as [a, b]}
        <span class="fw-light">"{a}": "{b}"</span>
        <br />
      {/each}
    </details>
  {/if}
</div>
