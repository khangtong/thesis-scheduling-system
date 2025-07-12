package com.example.back_end.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

public class TimeSlotDTO {
    private Integer id;
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
    private Integer defensePeriodId;
    private LocalTime startMorningPhase;
    private LocalTime endMorningPhase;
    private LocalTime startAfternoonPhase;
    private LocalTime endAfternoonPhase;
    private Integer timeLength;
    private Integer defenseCommitteeId;

    public TimeSlotDTO() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStart() {
        return start;
    }

    public void setStart(LocalTime start) {
        this.start = start;
    }

    public LocalTime getEnd() {
        return end;
    }

    public void setEnd(LocalTime end) {
        this.end = end;
    }

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

    public Integer getDefenseCommitteeId() {
        return defenseCommitteeId;
    }

    public void setDefenseCommitteeId(Integer defenseCommitteeId) {
        this.defenseCommitteeId = defenseCommitteeId;
    }
}
