package com.example.chatApplication.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomDto {
    private String roomId;
    private List<MessageDto> messages;
}