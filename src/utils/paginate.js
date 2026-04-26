/**
 * Slice an in-memory array for pagination.
 * @param {Array}  arr
 * @param {number} page  – 1-based
 * @param {number} limit
 * @returns {{ data: Array, total: number, page: number, limit: number }}
 */
export function paginate(arr, page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, Math.max(1, parseInt(limit)));
  const start = (p - 1) * l;
  return {
    data: arr.slice(start, start + l),
    total: arr.length,
    page: p,
    limit: l,
  };
}
