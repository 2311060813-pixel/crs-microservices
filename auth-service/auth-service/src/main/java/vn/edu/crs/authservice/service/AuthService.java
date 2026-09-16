package vn.edu.crs.authservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.crs.authservice.dto.LoginRequest;
import vn.edu.crs.authservice.dto.LoginResponse;
import vn.edu.crs.authservice.entity.User;
import vn.edu.crs.authservice.repository.UserRepository;
import vn.edu.crs.authservice.util.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("Username hoac password khong dung"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Username hoac password khong dung");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRole(),
                user.getId()
        );
    }
}