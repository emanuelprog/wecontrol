package com.app.wecontrol.exception;

public class InvalidRequestException extends RuntimeException{

    public InvalidRequestException(String message, Exception e) {
        super(message, e);
    }

}
