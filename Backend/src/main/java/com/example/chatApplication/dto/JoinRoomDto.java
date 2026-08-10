package com.example.chatApplication.dto;

import com.example.chatApplication.entity.Message;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomDto {

    private String roomId;
    private List<Message> messages;

}
