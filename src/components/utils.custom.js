async function parseJSON(res, apiRes) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok || data.success === false) {
    apiRes.success = false;
    apiRes.errors = data.errors || ["Unexpected server error"];
  } else {
    apiRes.data = data.data || data;
  }
}

async function parseFetchError(res) {
  res.success = false;
  res.errors.push("Network error while contacting server");
}

/**
 * Basic GET fetch with optional fallback URL
 */
export async function apiFetch(path, method = "GET") {
  const apiResponse = { success: true, errors: [], data: [] };
  const url = new URL(
    path,
    process.env.REACT_APP_BACKEND_URL || window.location.origin,
  );

  try {
    const response = await fetch(url.toString(), { method });
    await parseJSON(response, apiResponse);
  } catch (err) {
    console.error("apiFetch failed:", err);
    await parseFetchError(apiResponse);
  }

  return apiResponse;
}

export function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export function compileErrors(arr) {
  return arr.join("\n");
}
