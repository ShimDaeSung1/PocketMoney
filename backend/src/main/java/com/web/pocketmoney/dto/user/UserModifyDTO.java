package com.web.pocketmoney.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserModifyDTO {

    //현재 비밀번호 맞는지 확인
//    private String currentPassword;

    //새로운 비밀번호
//    private String newPassword;

    private String sex;

    private String nickName;

    private int age;

    private String city;

}
