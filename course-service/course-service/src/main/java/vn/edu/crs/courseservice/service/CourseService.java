package vn.edu.crs.courseservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.crs.courseservice.dto.CourseDTO;
import vn.edu.crs.courseservice.entity.Course;
import vn.edu.crs.courseservice.repository.CourseRepository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    // Lấy tất cả khóa học
    public List<CourseDTO> getAll() {
        return courseRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Lấy khóa học theo ID
    public CourseDTO getById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = " + id
                        )
                );

        return toDTO(course);
    }

    // Thêm khóa học
    public CourseDTO create(CourseDTO dto) {

        if (courseRepository.existsByTenMonHocIgnoreCase(dto.getTenMonHoc())) {
            throw new IllegalArgumentException(
                    "Ten mon hoc da ton tai"
            );
        }

        Course course = new Course();

        course.setTenMonHoc(dto.getTenMonHoc());
        course.setSoTinChi(dto.getSoTinChi());
        course.setSoChoToiDa(dto.getSoChoToiDa());

        // Khi tạo mới, số chỗ còn lại = số chỗ tối đa
        course.setSoChoConLai(dto.getSoChoToiDa());

        return toDTO(courseRepository.save(course));
    }

    // Cập nhật khóa học
    public CourseDTO update(Long id, CourseDTO dto) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = " + id
                        )
                );

        course.setTenMonHoc(dto.getTenMonHoc());
        course.setSoTinChi(dto.getSoTinChi());
        course.setSoChoToiDa(dto.getSoChoToiDa());

        return toDTO(courseRepository.save(course));
    }

    // Xóa khóa học
    public void delete(Long id) {

        if (!courseRepository.existsById(id)) {
            throw new NoSuchElementException(
                    "Khong tim thay mon hoc id = " + id
            );
        }

        courseRepository.deleteById(id);
    }

    // Search + Pagination
    public Page<CourseDTO> search(String keyword, Pageable pageable) {

        Page<Course> page = (keyword == null || keyword.isBlank())
                ? courseRepository.findAll(pageable)
                : courseRepository.findByTenMonHocContainingIgnoreCase(
                keyword,
                pageable
        );

        return page.map(this::toDTO);
    }

    // Đăng ký một chỗ
    @Transactional
    public CourseDTO reserveSeat(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = " + courseId
                        )
                );

        // Kiểm tra đã hết chỗ
        if (course.getSoChoConLai() <= 0) {
            throw new IllegalStateException(
                    "Mon hoc da het cho, khong the dang ky"
            );
        }

        // Giảm số chỗ còn lại đi 1
        course.setSoChoConLai(
                course.getSoChoConLai() - 1
        );

        return toDTO(courseRepository.save(course));
    }

    // Hủy đăng ký và trả lại một chỗ
    @Transactional
    public CourseDTO releaseSeat(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = " + courseId
                        )
                );

        // Không cho số chỗ còn lại vượt quá số chỗ tối đa
        if (course.getSoChoConLai() < course.getSoChoToiDa()) {
            course.setSoChoConLai(
                    course.getSoChoConLai() + 1
            );
        }

        return toDTO(courseRepository.save(course));
    }

    // Chuyển Entity sang DTO
    private CourseDTO toDTO(Course course) {

        return new CourseDTO(
                course.getId(),
                course.getTenMonHoc(),
                course.getSoTinChi(),
                course.getSoChoToiDa(),
                course.getSoChoConLai()
        );
    }
}