// Every item through fn, n at a time, the results in the items' order: the
// tests that render in Chromium spend their time waiting on pages, which
// run side by side; each keeps its failures in its items' order this way.
export async function pool(items, n, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
}
