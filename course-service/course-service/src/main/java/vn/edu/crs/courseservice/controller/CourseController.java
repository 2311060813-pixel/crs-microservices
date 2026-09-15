package vn.edu.crs.courseservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.courseservice.dto.CourseDTO;
import vn.edu.crs.courseservice.service.CourseService;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // 1. Lấy tất cả môn học
    @GetMapping
    public List<CourseDTO> getAll() {
        return courseService.getAll();
    }

    // 2. Lấy môn học theo ID
    @GetMapping("/{id}")
    public CourseDTO getById(@PathVariable Long id) {
        return courseService.getById(id);
    }

    // 3. Thêm môn học
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDTO create(@Valid @RequestBody CourseDTO dto) {
        return courseService.create(dto);
    }

    // 4. Cập nhật môn học
    @PutMapping("/{id}")
    public CourseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody CourseDTO dto
    ) {
        return courseService.update(id, dto);
    }

    // 5. Xóa môn học
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        courseService.delete(id);
    }
}