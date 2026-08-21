package com.example.chatApplication.controller;

import com.example.chatApplication.dto.*;
import com.example.chatApplication.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<ApiResponse<RoomDto>> createRoom(@RequestBody CreateRoomDto createRoomDto){
        ApiResponse<RoomDto> response = roomService.createRoom(createRoomDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<JoinRoomDto>> getRoom(@PathVariable String roomId){
        ApiResponse<JoinRoomDto> response = roomService.getRoomDetails(roomId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/{roomId}/messages")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getMessages(@PathVariable String roomId){
        ApiResponse<List<MessageDto>> response = roomService.getRoomMessages(roomId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}
