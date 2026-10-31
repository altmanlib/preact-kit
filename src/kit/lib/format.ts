const pad = (value: number) => String(value).padStart(2, "0");

/** Local time as `YYYY-MM-DD HH:mm:ss`. */
export function formatTime(ms: number): string {
  const date = new Date(ms);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
