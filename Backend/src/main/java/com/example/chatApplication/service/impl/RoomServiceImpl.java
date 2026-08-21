package com.example.chatApplication.service.impl;

import com.example.chatApplication.dto.*;
import com.example.chatApplication.entity.Message;
import com.example.chatApplication.entity.Room;
import com.example.chatApplication.repository.RoomRepository;
import com.example.chatApplication.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;


    @Override
    public ApiResponse<RoomDto> createRoom(CreateRoomDto createRoomDto) {
        Optional<Room> existing = roomRepository.findById(createRoomDto.getRoomId());

        if (existing.isPresent()) {
            return ApiResponse.failure("Room with id " + createRoomDto.getRoomId() + " already exists");
        }

        Room room = Room.builder()
                .roomId(createRoomDto.getRoomId())
                .name(createRoomDto.getName())
                .build();

        Room saved = roomRepository.save(room);

        RoomDto dto = RoomDto.builder()
                .roomId(saved.getRoomId())
                .name(saved.getName())
                .build();

        return ApiResponse.success("Room created successfully", dto);
    }

    @Override
    public ApiResponse<JoinRoomDto> getRoomDetails(String roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);

        if (room == null) {
            return ApiResponse.failure("Room not found");
        }

        List<MessageDto> messageDtos = room.getMessages().stream()
                .map(message -> MessageDto.builder()
                        .id(message.getId())
                        .sender(message.getSender())
                        .content(message.getContent())
                        .time(MessageDto.formatTime(message.getCreatedAt()))
                        .timestamp(message.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        JoinRoomDto dto = JoinRoomDto.builder()
                .roomId(room.getRoomId())
                .messages(messageDtos)
                .build();

        return ApiResponse.success("Room details retrieved successfully", dto);
    }

    @Override
    public ApiResponse<List<MessageDto>> getRoomMessages(String roomId) {

        Room room = roomRepository.findById(roomId).orElse(null);

        if (room == null) {
            return ApiResponse.failure("Room not found");
        }

        List<Message> messages = room.getMessages();

        List<MessageDto> messageDtos = messages.stream()
                .map(message -> MessageDto.builder()
                        .id(message.getId())
                        .sender(message.getSender())
                        .content(message.getContent())
                        .time(MessageDto.formatTime(message.getCreatedAt()))
                        .timestamp(message.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ApiResponse.success("Messages retrieved successfully", messageDtos);
    }


}
