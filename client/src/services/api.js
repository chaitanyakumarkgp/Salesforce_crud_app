import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

export const getAuthStatus = () =>
  api.get("/auth/status");

export const login = () => {
  window.location.href =
    "http://localhost:5000/api/auth/login";
};

export const logout = () =>
  api.post("/auth/logout");

export const getRecords = (
  objectName,
  page
) =>
  api.get(
    `/salesforce/records/${objectName}?page=${page}`
  );

export const createRecord = (objectName, data) =>
  api.post(`/salesforce/records/${objectName}`, data);

export const updateRecord = (
  objectName,
  id,
  data
) =>
  api.put(
    `/salesforce/records/${objectName}/${id}`,
    data
  );

export const deleteRecord = (
  objectName,
  id
) =>
  api.delete(
    `/salesforce/records/${objectName}/${id}`
  );

export default api;