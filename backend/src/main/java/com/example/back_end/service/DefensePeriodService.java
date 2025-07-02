package com.example.back_end.service;

import com.example.back_end.dao.DefensePeriodRepository;
import com.example.back_end.entity.DefensePeriod;
import com.example.back_end.entity.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DefensePeriodService {
    private DefensePeriodRepository defensePeriodRepository;

    @Autowired
    public DefensePeriodService(DefensePeriodRepository defensePeriodRepository) {
        this.defensePeriodRepository = defensePeriodRepository;
    }

    @Transactional(readOnly = true)
    public List<DefensePeriod> getAllDefensePeriods() {
        return defensePeriodRepository.findAll();
    }

    @Transactional(readOnly = true)
    public DefensePeriod getDefensePeriodById(int id) {
        DefensePeriod defensePeriod = defensePeriodRepository.findById(id).orElse(null);
        if (defensePeriod == null)
            throw new Error("Không tìm thấy đợt bảo vệ");
        return defensePeriod;
    }

    @Transactional(readOnly = true)
    public List<DefensePeriod> searchDefensePeriods(String query) {
        return defensePeriodRepository.searchDefensePeriods(query);
    }

    @Transactional
    public DefensePeriod createDefensePeriod(DefensePeriod defensePeriod) {
        DefensePeriod newDefensePeriod = new DefensePeriod();

        if ("".equals(defensePeriod.getName()))
            throw new Error("Tên đợt bảo vệ không được là rỗng");
        newDefensePeriod.setName(defensePeriod.getName());

        if (defensePeriod.getStart() == null)
            throw new Error("Thời gian bắt đầu không được là rỗng");

        if (defensePeriod.getEnd() == null)
            throw new Error("Thời gian kết thúc không được là rỗng");

        if (defensePeriod.getStart().isAfter(defensePeriod.getEnd()))
            throw new Error("Thời gian bắt đầu và kết thúc không hợp lệ");

        newDefensePeriod.setStart(defensePeriod.getStart());
        newDefensePeriod.setEnd(defensePeriod.getEnd());
        newDefensePeriod.setActive(defensePeriod.isActive());
        return defensePeriodRepository.save(newDefensePeriod);
    }

    @Transactional
    public DefensePeriod updateDefensePeriodById(int id, DefensePeriod defensePeriod) {
        DefensePeriod dbDefensePeriod = defensePeriodRepository.findById(id).orElse(null);
        if (dbDefensePeriod == null)
            throw new Error("Không tìm thấy đợt bảo vệ");

        if ("".equals(defensePeriod.getName()))
            throw new Error("Tên đợt bảo vệ không được là rỗng");
        dbDefensePeriod.setName(defensePeriod.getName());

        if (defensePeriod.getStart() == null)
            throw new Error("Thời gian bắt đầu không được là rỗng");

        if (defensePeriod.getEnd() == null)
            throw new Error("Thời gian kết thúc không được là rỗng");

        if (defensePeriod.getStart().isAfter(defensePeriod.getEnd()))
            throw new Error("Thời gian bắt đầu và kết thúc không hợp lệ");

        dbDefensePeriod.setStart(defensePeriod.getStart());
        dbDefensePeriod.setEnd(defensePeriod.getEnd());
        dbDefensePeriod.setActive(defensePeriod.isActive());
        return defensePeriodRepository.save(dbDefensePeriod);
    }

    @Transactional
    public void deleteDefensePeriodById(int id) {
        DefensePeriod defensePeriod = defensePeriodRepository.findById(id).orElse(null);
        if (defensePeriod == null)
            throw new Error("Không tìm thấy bảo vệ");
        defensePeriodRepository.deleteById(id);
    }
}
