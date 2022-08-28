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

    private String password;

    private String sex;

    private String nickName;

    private int age;

    private String city;

}
