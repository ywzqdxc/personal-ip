package cn.iocoder.yudao.module.ip.controller.app.project.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "用户 App - 项目展示 Response VO")
@Data
public class AppProjectRespVO {

    @Schema(description = "主键", example = "1")
    private Long id;

    @Schema(description = "项目名称", example = "Personal IP Site")
    private String name;

    @Schema(description = "URL slug", example = "personal-ip-site")
    private String slug;

    @Schema(description = "简短描述")
    private String description;

    @Schema(description = "封面图 URL")
    private String coverUrl;

    @Schema(description = "悬浮预览图 URL")
    private String previewUrl;

    @Schema(description = "GitHub 链接")
    private String githubUrl;

    @Schema(description = "演示链接")
    private String demoUrl;

    @Schema(description = "技术栈，逗号分隔", example = "Next.js,Java,Three.js")
    private String techStack;

    @Schema(description = "Markdown 详情正文")
    private String content;

    @Schema(description = "是否置顶")
    private Boolean featured;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
