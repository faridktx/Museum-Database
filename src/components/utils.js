function showToastSuccessNotification() {
  const toast = compileToastNotification("toast-success", "Success!");
  let message = document.createElement("div");
  message.textContent = "Operation was successful";
  toast.appendChild(message);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

function showToastFailNotification(response) {
  const toast = compileToastNotification("toast-error", "Error!");
  createErrorMessage(toast, response.errors);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

function createErrorMessage(toast, errors) {
  for (let message of errors) {
    let errorElem = document.createElement("div");
    errorElem.textContent = message;
    toast.appendChild(errorElem);
  }
}

function compileToastNotification(toastClass, message) {
  const toast = document.createElement("div");
  const title = document.createElement("h3");
  title.classList.add(toastClass);
  title.textContent = message;
  toast.appendChild(title);
  toast.classList.add("toast");
  return toast;
}

export function toastProcess(response) {
  if (response.success) {
    showToastSuccessNotification();
  } else {
    showToastFailNotification(response);
  }
}

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

export async function apiGetFetch(path) {
  let apiResponse = { success: true, errors: [], data: [] };
  try {
    const response = await fetch(path, {
      method: "GET",
    });
    await parseJSON(response, apiResponse);
  } catch (err) {
    await parseFetchError(apiResponse);
  }
  return apiResponse;
}

export async function apiModifyFetch(path, method, formData) {
  let apiResponse = { success: true, errors: [] };
  try {
    const response = await fetch(path, {
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
