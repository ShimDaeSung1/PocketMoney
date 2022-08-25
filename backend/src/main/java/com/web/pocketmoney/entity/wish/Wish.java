package com.web.pocketmoney.entity.wish;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.web.pocketmoney.entity.base.BaseEntity;
import com.web.pocketmoney.entity.board.Board;
import com.web.pocketmoney.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class Wish extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    //이 글을 관심글 등록한 사용자 아이디
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User userId;

    @ManyToOne
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board boardId;
}
