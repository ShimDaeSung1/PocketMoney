package com.web.pocketmoney.dto.board;

import lombok.Data;

import java.util.List;

@Data
public class BoardRequestDto {
    private String title;
    private String content;
    private String area;
    private List<Integer> dayOfWeek;
    private String[] date = new String[5]; // year, month, day, hour, minute
    private String pay;
   // private User user;
}
