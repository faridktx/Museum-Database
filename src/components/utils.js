export function showToastSuccessNotification(object, operation) {
  showToastNotification(`toast-success`, `${object} ${operation} successfully`);
}

export function showToastFailNotification(object, operation) {
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

export async function apiFetch(path, method, formData) {
  let apiFetchResponse = { success: true, message: null };
  try {
    const response = await fetch(path, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    console.log(response);
    if (response.status !== 200) {
      const data = await response.json();
      apiFetchResponse.success = false;
      apiFetchResponse.message = data.message;
    }
  } catch (err) {
    apiFetchResponse.success = false;
    console.log("Error handling submission of form...", err);
  }
  return apiFetchResponse;
}
