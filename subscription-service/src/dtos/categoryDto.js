class CategoryDto {
    constructor(data) {
        // Tên danh mục (ví dụ: "Lập trình .NET")
        this.name = data.name;

        // ID cha trong DB của mình (Local) - Mặc định là 0 nếu không gửi
        // Ép kiểu Number để tránh lỗi khi Joi hoặc Logic so sánh
        this.parent_id = data.parent_id !== undefined ? Number(data.parent_id) : 0;

        // Các thông tin bổ sung nếu ông muốn mở rộng sau này
        this.status = data.status !== undefined ? Number(data.status) : 1;
        this.description = data.description || "";
    }
}

module.exports = CategoryDto;