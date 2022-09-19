package com.web.pocketmoney.dto.like;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LikeDTO {
    
    //상대방 유저 아이디와 좋아요여부
    private Long likeId;
    private String like;
}
