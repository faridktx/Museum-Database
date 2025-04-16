import { apiFetch } from "../utils";

const optionSetter = async (path, setter, token) => {
  const response = await apiFetch(path, "GET", token);
  setter(response.data);
};

export const exhibitSetter = async (setter, token) => {
  await optionSetter("/api/getexhibits/", setter, token);
};

export const artistSetter = async (setter, token) => {
  await optionSetter("/api/getartists/", setter, token);
};
