package com.web.pocketmoney.dto.board;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
public class BoardHomeDto {
    private String title;
    private int pay;
    private String city;
    private int view;
    private Timestamp createTime;
    //  private String nickName;
    private Long boardId;
    private LocalDateTime wantedTime;

    public BoardHomeDto(String title, int pay, String city, int view, Timestamp createTime, Long boardId, LocalDateTime wantedTime) {
        this.title = title;
        this.pay = pay;
        this.city = city;
        this.view = view;
        this.createTime = createTime;
        this.boardId = boardId;
        this.wantedTime = wantedTime;
    }
}
