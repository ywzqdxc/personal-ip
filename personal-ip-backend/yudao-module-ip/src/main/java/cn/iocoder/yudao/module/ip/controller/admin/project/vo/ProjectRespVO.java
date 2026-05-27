package cn.iocoder.yudao.module.ip.controller.admin.project.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - 项目展示 Response VO")
@Data
public class ProjectRespVO {

    @Schema(description = "主键", example = "1")
    private Long id;

    @Schema(description = "项目名称")
    private String name;

    @Schema(description = "URL 标识")
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

    @Schema(description = "技术栈，逗号分隔")
    private String techStack;

    @Schema(description = "Markdown 详情")
    private String content;

    @Schema(description = "排序权重")
    private Integer sortOrder;

    @Schema(description = "是否首页置顶")
    private Boolean featured;

    @Schema(description = "状态 0草稿 1发布")
    private Integer status;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
