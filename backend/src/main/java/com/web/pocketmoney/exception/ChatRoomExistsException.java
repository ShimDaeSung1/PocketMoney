package com.web.pocketmoney.exception;

import com.web.pocketmoney.exception.handler.ErrorCode;
import lombok.Getter;

@Getter
public class ChatRoomExistsException extends RuntimeException{

    private ErrorCode errorCode;

    public ChatRoomExistsException(String msg, ErrorCode errorCode){
        super(msg);
        this.errorCode = errorCode;
    }
}
