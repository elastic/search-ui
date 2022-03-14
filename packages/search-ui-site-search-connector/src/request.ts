export default async function request(
  engineKey: string,
  method: string,
  path: string,
  params: Record<string, any>
) {
  const headers = new Headers({
    "Content-Type": "application/json"
  });

  const response = await fetch(
    `https://search-api.swiftype.com/api/v1/public/${path}`,
    {
      method,
      headers,
      body: JSON.stringify({
        engine_key: engineKey,
        ...params
      }),
      credentials: "include"
    }
  );

  let json;
  try {
    json = await response.json();
  } catch (error) {
    // Nothing to do here, certain responses won't have json
  }

  if (response.status >= 200 && response.status < 300) {
    return json;
  } else {
    const message =
      json && json.errors && Object.entries(json.errors).length > 0
        ? JSON.stringify(json.errors)
        : response.status;
    throw new Error(`${message}`);
  }
}
