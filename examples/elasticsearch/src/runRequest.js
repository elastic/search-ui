export default async function runRequest(body) {
  const response = await fetch(".netlify/functions/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}
