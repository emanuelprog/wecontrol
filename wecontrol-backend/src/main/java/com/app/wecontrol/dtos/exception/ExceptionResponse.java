package com.app.wecontrol.dtos.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ExceptionResponse {

    private String message;

    private int status;
}
