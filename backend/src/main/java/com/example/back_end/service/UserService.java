package com.example.back_end.service;

import com.example.back_end.dao.RoleRepository;
import com.example.back_end.dao.UserRepository;
import com.example.back_end.dto.UserDTO;
import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class UserService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            throw new Error("Không tìm thấy người dùng");
        return user;
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return user;
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        return user;
    }

    @Transactional(readOnly = true)
    public List<User> searchUsers(String query) {
        return userRepository.searchUsers(query);
    }

    @Transactional
    public User createUser(UserDTO userDTO) {
        User newUser = new User();

        if ("".equals(userDTO.getUsername()))
            throw new Error("Tên tài khoản không được là rỗng");
        newUser.setUsername(userDTO.getUsername());

        if ("".equals(userDTO.getPassword()) || userDTO.getPassword().length() < 6)
            throw new Error("Mật khẩu không hợp lệ");
        newUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        if ("".equals(userDTO.getEmail()) || !userDTO.getEmail().matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"))
            throw new Error("Email không hợp lệ");
        newUser.setEmail(userDTO.getEmail());

        if ("".equals(userDTO.getFullname()))
            throw new Error("Họ tên không được là rỗng");
        newUser.setFullname(userDTO.getFullname());

        if (userDTO.getRoleId() != null) {
            Role role = roleRepository.findById(userDTO.getRoleId()).orElse(null);
            if (role == null)
                throw new Error("Không tìm thấy vai trò");
            newUser.setRole(role);
        } else {
            throw new Error("Vai trò không được là rỗng");
        }

        newUser.setActive(true);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(newUser);
    }

    @Transactional
    public User updateUserById(int id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            throw new Error("Không tìm thấy người dùng");

        if ("".equals(userDTO.getUsername()))
            throw new Error("Tên tài khoản không được là rỗng");
        user.setUsername(userDTO.getUsername());

        if ("".equals(userDTO.getEmail()) || !userDTO.getEmail().matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"))
            throw new Error("Email không hợp lệ");
        user.setEmail(userDTO.getEmail());

        if ("".equals(userDTO.getFullname()))
            throw new Error("Họ tên không được là rỗng");
        user.setFullname(userDTO.getFullname());

        user.setActive(userDTO.isActive());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public User updateMe(int id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            throw new Error("Không tìm thấy người dùng");

        if ("".equals(userDTO.getUsername()))
            throw new Error("Tên tài khoản không được là rỗng");
        user.setUsername(userDTO.getUsername());

        if ("".equals(userDTO.getEmail()) || !userDTO.getEmail().matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"))
            throw new Error("Email không hợp lệ");
        user.setEmail(userDTO.getEmail());

        if ("".equals(userDTO.getFullname()))
            throw new Error("Họ tên không được là rỗng");
        user.setFullname(userDTO.getFullname());

        user.setActive(userDTO.isActive());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public User updatePassword(int id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            throw new Error("Không tìm thấy người dùng");

        if (userDTO.getCurrentPassword() == null || !passwordEncoder.matches(userDTO.getCurrentPassword(), user.getPassword()))
            throw new Error("Mật khẩu không khớp với mật khẩu hiện tại");

        if ("".equals(userDTO.getNewPassword()) || userDTO.getNewPassword().length() < 6)
            throw new Error("Mật khẩu mới không hợp lệ");

        if ("".equals(userDTO.getConfirmPassword()) || userDTO.getConfirmPassword().length() < 6)
            throw new Error("Mật khẩu xác nhận không hợp lệ");

        if (!userDTO.getNewPassword().equals(userDTO.getConfirmPassword()))
            throw new Error("Mật khẩu mới và mật khẩu xác nhận không trùng khớp");

        user.setPassword(passwordEncoder.encode(userDTO.getNewPassword()));
        user.setActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUserById(int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            throw new Error("Không tìm thấy người dùng");

        userRepository.deleteById(id);
    }
}
