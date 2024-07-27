package com.app.wecontrol.utils;

import com.app.wecontrol.dtos.defaultResponse.DefaultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtil {

    public static ResponseEntity<DefaultResponse> generateResponse(String message, HttpStatus status, Object object) {
        DefaultResponse defaultResponse = new DefaultResponse(
                status.value(),
                message,
                object
        );

        return new ResponseEntity<>(defaultResponse, status);
    }
}
