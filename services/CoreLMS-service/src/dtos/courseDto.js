class CourseDTO {
    constructor(course) {
        this.id = course.id;                    // Moodle course ID
        this.title = course.fullname;           // Display name
        this.code = course.shortname;           // Unique course code
        this.categoryId = course.categoryid;      
        this.summary = course.summary || "";    // Short description
        this.thumbnail = course.courseimage || null; // Course image URL
        this.rating = course.avgRating || 0;    // Average stars (0-5)
        this.tags = course.tags || [];          // Array of tag names
    }
}

module.exports = CourseDTO; 