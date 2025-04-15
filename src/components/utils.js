async function parseJSON(res, apiRes) {
  const data = await res.json();
  if (res.status !== 200) {
    apiRes.success = false;
    apiRes.errors = data.errors;
  } else {
    apiRes.data = data;
  }
}

async function parseFetchError(res) {
  res.success = false;
  res.errors.push("Error handling submission of form");
}

export async function apiFetch(path, method, token) {
  let apiResponse = { success: true, errors: [], data: [] };
  const url = new URL(path, process.env.REACT_APP_BACKEND_URL);
  url.searchParams.append("id", token);
  try {
    const response = await fetch(url.toString(), {
      method: method,
    });
    await parseJSON(response, apiResponse);
  } catch (err) {
    console.log(err);
    await parseFetchError(apiResponse);
  }
  return apiResponse;
}

export async function fetchWithBody(path, method, formData) {
  let apiResponse = { success: true, errors: [] };
  const url = new URL(path, process.env.REACT_APP_BACKEND_URL);
  try {
    const response = await fetch(url.toString(), {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    await parseJSON(response, apiResponse);
  } catch (err) {
    await parseFetchError(apiResponse);
  }
  return apiResponse;
}

export function capitalize(str) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}

export function compileErrors(arr) {
  return arr.reduce((message, error) => {
    return `${message}\n${error}`;
  }, "");
}
