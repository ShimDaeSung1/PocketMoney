package com.web.pocketmoney.entity.room;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class ChatRoom {
    @Id @GeneratedValue
    @Column(name = "roomId")
    private Long id;

    @OneToMany(mappedBy = "chatRoom")
    private List<message> messages = ArrayList<>();
}
