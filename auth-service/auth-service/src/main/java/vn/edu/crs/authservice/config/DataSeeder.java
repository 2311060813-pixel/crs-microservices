package vn.edu.crs.authservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.edu.crs.authservice.entity.Student;
import vn.edu.crs.authservice.entity.User;
import vn.edu.crs.authservice.repository.UserRepository;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;

    @Bean
    public CommandLineRunner seedData(PasswordEncoder passwordEncoder) {

        return args -> {

            // =========================
            // Tạo tài khoản ADMIN
            // =========================
            if (!userRepository.existsByUsername("admin")) {

                User admin = new User();

                admin.setUsername("admin");
                admin.setPassword(
                        passwordEncoder.encode("admin123")
                );
                admin.setRole("ADMIN");

                userRepository.save(admin);
            }

            // =========================
            // Tạo tài khoản STUDENT
            // =========================
            if (!userRepository.existsByUsername("student1")) {

                User studentUser = new User();

                studentUser.setUsername("student1");
                studentUser.setPassword(
                        passwordEncoder.encode("student123")
                );
                studentUser.setRole("STUDENT");

                userRepository.save(studentUser);
            }

            System.out.println("====================================");
            System.out.println("AUTH DATA SEED HOAN TAT");
            System.out.println("admin    / admin123");
            System.out.println("student1 / student123");
            System.out.println("====================================");
        };
    }
}