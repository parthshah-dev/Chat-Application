import { httpClient } from "../config/AxiosHelper";

export const createRoomAPI = async (roomDetail) => {
  const response = await httpClient.post("/rooms", roomDetail);
  console.log("createRoomAPI response:", response.data);
  return response.data;
};

export const joinRoomAPI = async (roomId) => {
  const response = await httpClient.get(`/rooms/${roomId}`);
  return response.data;
};

export const getMessagesAPI = async (roomId) => {
  const response = await httpClient.get(`/rooms/${roomId}/messages`);
  return response.data;
};
