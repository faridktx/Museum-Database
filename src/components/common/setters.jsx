import { apiGetFetch } from "../utils";

const optionSetter = async (path, setter) => {
  const response = await apiGetFetch(path);
  setter(response.data);
};

export const exhibitSetter = async (setter) => {
  await optionSetter("/api/getexhibits/", setter);
};

export const artistSetter = async (setter) => {
  await optionSetter("/api/getartists/", setter);
};
