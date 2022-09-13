package com.web.pocketmoney.dto.chatRoom;

import com.web.pocketmoney.dto.message.MessageDetailDto;
import com.web.pocketmoney.entity.room.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoomDetailDto {

    private Long id;
    private String name;
    
    //생성날짜랑, 상대방유저
    private Timestamp regDate;
    private Long userId;
    private String nickName;

    //상대방유저를 좋아요 눌렀는지 여부
    private boolean like;

    private List<MessageDetailDto> messageDetailDtoList;

//    public static ChatRoomDetailDto toChatRoomDetailDto(ChatRoom chatRoom){
//        ChatRoomDetailDto chatRoomDetailDto = new ChatRoomDetailDto();
//
//        chatRoomDetailDto.setChatRoomId(chatRoom.getId());
//        chatRoomDetailDto.setChatMentor(chatRoom.getChatMentor());
//        chatRoomDetailDto.setRoomId(chatRoom.getRoomId());
//        chatRoomDetailDto.setName(chatRoom.getRoomName());
//
//        return chatRoomDetailDto;
//    }
}

