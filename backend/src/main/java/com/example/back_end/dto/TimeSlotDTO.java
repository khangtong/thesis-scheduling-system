package com.example.back_end.dto;

import java.time.LocalTime;

public class TimeSlotDTO {
    private Integer defensePeriodId;
    private LocalTime startMorningPhase;
    private LocalTime endMorningPhase;
    private LocalTime startAfternoonPhase;
    private LocalTime endAfternoonPhase;
    private Integer timeLength;

    public TimeSlotDTO() {}

    public Integer getDefensePeriodId() {
        return defensePeriodId;
    }

    public void setDefensePeriodId(Integer defensePeriodId) {
        this.defensePeriodId = defensePeriodId;
    }

    public LocalTime getStartMorningPhase() {
        return startMorningPhase;
    }

    public void setStartMorningPhase(LocalTime startMorningPhase) {
        this.startMorningPhase = startMorningPhase;
    }

    public LocalTime getEndMorningPhase() {
        return endMorningPhase;
    }

    public void setEndMorningPhase(LocalTime endMorningPhase) {
        this.endMorningPhase = endMorningPhase;
    }

    public LocalTime getStartAfternoonPhase() {
        return startAfternoonPhase;
    }

    public void setStartAfternoonPhase(LocalTime startAfternoonPhase) {
        this.startAfternoonPhase = startAfternoonPhase;
    }

    public LocalTime getEndAfternoonPhase() {
        return endAfternoonPhase;
    }

    public void setEndAfternoonPhase(LocalTime endAfternoonPhase) {
        this.endAfternoonPhase = endAfternoonPhase;
    }

    public Integer getTimeLength() {
        return timeLength;
    }

    public void setTimeLength(Integer timeLength) {
        this.timeLength = timeLength;
    }
}
