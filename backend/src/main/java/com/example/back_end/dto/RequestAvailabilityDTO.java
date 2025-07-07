package com.example.back_end.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RequestAvailabilityDTO {
    private Integer defensePeriodId;
    private List<Integer> selectedFaculties;
    private LocalDateTime deadline;

    public RequestAvailabilityDTO() {}

    public Integer getDefensePeriodId() {
        return defensePeriodId;
    }

    public void setDefensePeriodId(Integer defensePeriodId) {
        this.defensePeriodId = defensePeriodId;
    }

    public List<Integer> getSelectedFaculties() {
        return selectedFaculties;
    }

    public void setSelectedFaculties(List<Integer> selectedFaculties) {
        this.selectedFaculties = selectedFaculties;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
}
