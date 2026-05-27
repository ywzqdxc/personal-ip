package cn.iocoder.yudao.module.ip.controller.admin.project.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "管理后台 - 项目展示新增/修改 Request VO")
@Data
public class ProjectSaveReqVO {

    @Schema(description = "主键（修改时必填）", example = "1")
    private Long id;

    @Schema(description = "项目名称", requiredMode = Schema.RequiredMode.REQUIRED, example = "Personal IP Site")
    @NotBlank(message = "项目名称不能为空")
    private String name;

    @Schema(description = "URL 标识", requiredMode = Schema.RequiredMode.REQUIRED, example = "personal-ip-site")
    @NotBlank(message = "slug 不能为空")
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

    @Schema(description = "排序权重", example = "0")
    private Integer sortOrder;

    @Schema(description = "是否首页置顶", example = "false")
    private Boolean featured;

    @Schema(description = "状态 0草稿 1发布", requiredMode = Schema.RequiredMode.REQUIRED, example = "0")
    @NotNull(message = "状态不能为空")
    private Integer status;
}
