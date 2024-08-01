package com.app.wecontrol.utils;

import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class MoaiUtils {

    public String formatterLocalDateToString(LocalDateTime date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return date.toLocalDate().format(formatter);
    }

    public String convertLocalDateTimeToString(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return dateTime.format(formatter);
    }

    public int extractMonths(String duration) {
        Pattern pattern = Pattern.compile("(\\d+)\\s*(month|months)?", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(duration);

        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }

        return 0;
    }

    public LocalDateTime getFirstBusinessDayOfMonth(LocalDate date) {
        LocalDate firstDay = date.with(TemporalAdjusters.firstDayOfMonth());
        while (firstDay.getDayOfWeek() == DayOfWeek.SATURDAY || firstDay.getDayOfWeek() == DayOfWeek.SUNDAY) {
            firstDay = firstDay.plusDays(1);
        }
        LocalDateTime firstDayStart = firstDay.atStartOfDay();
        return firstDayStart.withHour(0).withMinute(1).minusHours(4);
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
        return fifthDayEnd.withHour(18).withMinute(0).minusHours(4);
    }
}
