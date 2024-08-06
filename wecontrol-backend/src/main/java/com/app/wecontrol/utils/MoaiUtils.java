package com.app.wecontrol.utils;

import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;

@Component
public class MoaiUtils {

    public String formatterLocalDateToString(LocalDateTime date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return date.toLocalDate().format(formatter);
    }

    public String formatterLocalDateTimeToString(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return dateTime.format(formatter);
    }

    public LocalDateTime formatterStringToLocalDateTime(String dateTimeString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return LocalDateTime.parse(dateTimeString, formatter);
    }

    public LocalDateTime getFirstBusinessDayOfMonth(LocalDate date) {
        LocalDate firstDay = date.with(TemporalAdjusters.firstDayOfMonth());
        while (firstDay.getDayOfWeek() == DayOfWeek.SATURDAY || firstDay.getDayOfWeek() == DayOfWeek.SUNDAY) {
            firstDay = firstDay.plusDays(1);
        }
        LocalDateTime firstDayStart = firstDay.atStartOfDay();
        return firstDayStart.withHour(0).withMinute(1);
    }

    public LocalDateTime getFifthBusinessDayOfMonth(LocalDate date) {
        LocalDate firstDay = getFirstBusinessDayOfMonth(date).toLocalDate();
        int businessDayCount = 1;
        LocalDate currentDay = firstDay;

        while (businessDayCount < 5) {
            currentDay = currentDay.plusDays(1);
            if (!(currentDay.getDayOfWeek() == DayOfWeek.SATURDAY || currentDay.getDayOfWeek() == DayOfWeek.SUNDAY)) {
                businessDayCount++;
            }
        }
        LocalDateTime fifthDayEnd = currentDay.atStartOfDay();
        return fifthDayEnd.withHour(18).withMinute(0);
    }
}
