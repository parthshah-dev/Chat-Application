package com.example.chatApplication.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {

    private String sender;
    private String content;
    private LocalDateTime timestamp;

}
