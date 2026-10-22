// Every item through fn, n at a time, the results in the items' order:
// for work that waits (pages rendering in Chromium), which runs side by
// side, its failures kept in its items' order.
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
