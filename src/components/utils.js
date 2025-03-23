function showToastSuccessNotification(object, operation) {
  showToastNotification(`toast-success`, `${object} ${operation} successfully`);
}

function showToastFailNotification(object, operation) {
  showToastNotification(`toast-error`, `${object} ${operation} failed`);
}

function showToastNotification(toastClass, message) {
  localStorage.removeItem("modification");
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.classList.add(toastClass);
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

export function toastSuccess(entity, operation) {
  if (localStorage.getItem("modification") === "true") {
    showToastSuccessNotification(entity, operation);
  }
}

export function toastSuccessDelete(entity) {
  toastSuccess(entity, "deleted");
}

export function toastSuccessInsert(entity) {
  toastSuccess(entity, "inserted");
}

export function toastSuccessModify(entity) {
  toastSuccess(entity, "modified");
}

function toastProcess(response, entity, operation) {
  if (response.success) {
    localStorage.setItem("modification", "true");
    location.reload();
  } else {
    showToastFailNotification(entity, operation);
  }
}

export function toastProcessDelete(response, entity) {
  toastProcess(response, entity, "deletion");
}

export function toastProcessInsert(response, entity) {
  toastProcess(response, entity, "insertion");
}

export function toastProcessModify(response, entity) {
  toastProcess(response, entity, "modification");
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
