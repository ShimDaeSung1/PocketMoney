package com.web.pocketmoney.exception;

public class CNotNumberException extends RuntimeException{

    public CNotNumberException() {};
    public CNotNumberException(String message){
        super(message);
    }
// 사용자 정의 예외의 생성. 생성자는 보통 두 가지를 선언하는데
// 두 번째의 경우 에외 메시지를 전달하기 위해 String 타입의 매개 변수를 갖는 생성자이다.
}
