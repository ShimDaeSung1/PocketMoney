package com.web.pocketmoney.dto.like;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InsertLikeDTO {

    private Long userId;
    private Long likedId;
    private String liked;

}
