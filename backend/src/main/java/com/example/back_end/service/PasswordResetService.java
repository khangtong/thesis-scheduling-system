package com.example.back_end.service;

import com.example.back_end.entity.PasswordResetToken;
import com.example.back_end.entity.User; // Assuming you have a User entity
import com.example.back_end.dao.PasswordResetTokenRepository;
import com.example.back_end.dao.UserRepository; // Assuming you have a UserRepository
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    @Autowired
    public PasswordResetService(PasswordResetTokenRepository passwordResetTokenRepository,
                                UserRepository userRepository,
                                EmailService emailService,
                                PasswordEncoder passwordEncoder) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void initiatePasswordReset(String email) throws MessagingException {
        // Check if user exists
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Email không tồn tại trong hệ thống");
        }

        // Delete any existing tokens for this email
        passwordResetTokenRepository.deleteByEmail(email);

        // Generate 6-digit code
        String code = generateSixDigitCode();

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();

        // Save reset token
        PasswordResetToken passwordResetToken = new PasswordResetToken(email, code, resetToken);
        passwordResetTokenRepository.save(passwordResetToken);

        // Send email with code
        emailService.sendPasswordResetCodeEmail(email, user.getFullname(), code);
    }

    @Transactional
    public String verifyResetCode(String email, String code) {
        // Clean up expired tokens
        passwordResetTokenRepository.deleteExpiredTokens(LocalDateTime.now());

        Optional<PasswordResetToken> tokenOptional =
                passwordResetTokenRepository.findByEmailAndCodeAndUsedFalse(email, code);

        if (tokenOptional.isEmpty()) {
            throw new RuntimeException("Mã xác thực không hợp lệ hoặc đã hết hạn");
        }

        PasswordResetToken token = tokenOptional.get();

        if (token.isExpired()) {
            throw new RuntimeException("Mã xác thực đã hết hạn");
        }

        return token.getResetToken();
    }

    @Transactional
    public void resetPassword(String resetToken, String newPassword) {
        Optional<PasswordResetToken> tokenOptional =
                passwordResetTokenRepository.findByResetTokenAndUsedFalse(resetToken);

        if (tokenOptional.isEmpty()) {
            throw new RuntimeException("Token đặt lại mật khẩu không hợp lệ");
        }

        PasswordResetToken token = tokenOptional.get();

        if (token.isExpired()) {
            throw new RuntimeException("Token đặt lại mật khẩu đã hết hạn");
        }

        // Find user and update password
        User user = userRepository.findByEmail(token.getEmail());
        if (user == null) {
            throw new RuntimeException("Người dùng không tồn tại");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Mark token as used
        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }

    private String generateSixDigitCode() {
        int code = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(code);
    }

    // Optional: Method to clean up expired tokens (can be called periodically)
    @Transactional
    public void cleanupExpiredTokens() {
        passwordResetTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}