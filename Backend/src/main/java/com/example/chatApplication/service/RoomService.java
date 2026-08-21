package com.example.chatApplication.service;

import com.example.chatApplication.dto.*;

import java.util.List;

public interface RoomService {

    public ApiResponse<RoomDto> createRoom(CreateRoomDto createRoomDto);

    ApiResponse<JoinRoomDto> getRoomDetails(String roomId);

    ApiResponse<List<MessageDto>> getRoomMessages(String roomId);
}
