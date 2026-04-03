const courseService = require("../services/course.service");

class courseController {
    getFilterCourses = async(req, res, next) => {
        try {
            const filters = req.query;
            console.log("Query Filters:", filters);

            // Đổi tên biến cho chuẩn Clean Code
            const courses = await courseService.getFilteredCourses(filters);

            // Trả về 200 OK với mảng rỗng nếu không có dữ liệu (Chuẩn REST)
            if(!courses || courses.length === 0){ 
                return res.status(200).json({
                    success: true,
                    data: [],
                    message: 'No courses found matching the criteria'
                });
            }

            // Trả về dữ liệu thành công
            return res.status(200).json({
                success: true,
                data: courses,
            });

        } catch (error) {
            // "Tấm khiên" bắt mọi lỗi từ Service và Repo quăng lên
            console.error("🔥 Lỗi tại courseController:", error.message);
            
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
}

module.exports = new courseController(); // Nhớ thêm () khi khởi tạo class nhé