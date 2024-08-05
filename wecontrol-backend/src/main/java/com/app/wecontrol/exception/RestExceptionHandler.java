package com.app.wecontrol.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(NotFoundException ex, WebRequest request) {
        HashMap<String, Object> map = new HashMap<>();

        map.put("message", ex.getMessage());
        map.put("code", HttpStatus.NOT_FOUND.value());

        return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequestException(BadRequestException ex, WebRequest request) {
        HashMap<String, Object> map = new HashMap<>();

        map.put("message", ex.getMessage());
        map.put("code", HttpStatus.BAD_REQUEST.value());

        return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
    }
}
