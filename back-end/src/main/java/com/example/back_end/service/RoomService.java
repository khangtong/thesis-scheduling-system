package com.example.back_end.service;

import com.example.back_end.dao.RoomRepository;
import com.example.back_end.entity.Degree;
import com.example.back_end.entity.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomService {
    private RoomRepository roomRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Transactional(readOnly = true)
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Room getRoomById(int id) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null)
            throw new Error("Không tìm thấy phòng");
        return room;
    }

    @Transactional
    public Room createRoom(Room room) {
        Room newRoom = new Room();

        if ("".equals(room.getName()))
            throw new Error("Tên phòng không được là rỗng");
        newRoom.setName(room.getName());
        newRoom.setActive(room.isActive());

        return roomRepository.save(newRoom);
    }

    @Transactional
    public Room updateRoomById(int id, Room room) {
        Room dbRoom = roomRepository.findById(id).orElse(null);
        if (dbRoom == null)
            throw new Error("Không tìm thấy phòng");

        if ("".equals(room.getName()))
            throw new Error("Tên phòng không được là rỗng");
        dbRoom.setName(room.getName());
        dbRoom.setActive(room.isActive());

        return roomRepository.save(dbRoom);
    }

    @Transactional
    public void deleteRoomById(int id) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null)
            throw new Error("Không tìm thấy phòng");
        roomRepository.deleteById(id);
    }
}
