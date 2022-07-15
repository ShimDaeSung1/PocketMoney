package com.web.pocketmoney.entity.wish;

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

    @ManyToOne(fetch = FetchType.LAZY)
    private User userId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Board boardId;
}
