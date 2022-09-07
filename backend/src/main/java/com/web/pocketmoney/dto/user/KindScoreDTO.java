package com.web.pocketmoney.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KindScoreDTO {
    
    //채팅방 id와 상대방 유저 id, true false 구분
    private Long chatId;
    private Long userId;
    private boolean tf;
}
