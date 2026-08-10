package com.example.chatApplication.service;

import com.example.chatApplication.dto.ApiResponse;
import com.example.chatApplication.dto.CreateRoomDto;
import com.example.chatApplication.dto.JoinRoomDto;
import com.example.chatApplication.dto.RoomDto;

public interface RoomService {

    public ApiResponse<RoomDto> createRoom(CreateRoomDto createRoomDto);

    ApiResponse<JoinRoomDto> getRoomDetails(String roomId);
}
