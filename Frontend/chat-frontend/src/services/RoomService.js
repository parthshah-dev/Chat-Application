import { httpClient } from "../config/AxiosHelper";

export const createRoomAPI = async (roomDetail) => {
  const response = await httpClient.post("/api/rooms", roomDetail);
  console.log("createRoomAPI response:", response.data);
  return response.data;
};
