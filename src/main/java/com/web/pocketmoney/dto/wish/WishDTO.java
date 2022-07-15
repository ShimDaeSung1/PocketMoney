package com.web.pocketmoney.dto.wish;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishDTO {

    private Long id;

    private Long userId;

    private Long boardId;
}
