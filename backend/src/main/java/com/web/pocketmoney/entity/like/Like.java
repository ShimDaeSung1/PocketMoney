package com.web.pocketmoney.entity.like;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.web.pocketmoney.converter.BooleanToYNConverter;
import com.web.pocketmoney.entity.user.User;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn// 아래와 같이 User를 참조하는게 여러 번 나올경우, JoinColumn에는 아무것도 안 써줌
    @JsonIgnore
    private User userId;

    @ManyToOne
    @JoinColumn// 아래와 같이 User를 참조하는게 여러 번 나올경우, JoinColumn에는 아무것도 안 써줌
    @JsonIgnore
    private User likedId;

    @Convert(converter = BooleanToYNConverter.class)
    private boolean like;

}
