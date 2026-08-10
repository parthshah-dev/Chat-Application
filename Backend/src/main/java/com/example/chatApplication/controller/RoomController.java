package com.example.chatApplication.controller;

import com.example.chatApplication.dto.ApiResponse;
import com.example.chatApplication.dto.CreateRoomDto;
import com.example.chatApplication.dto.JoinRoomDto;
import com.example.chatApplication.dto.RoomDto;
import com.example.chatApplication.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
