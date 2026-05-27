package cn.iocoder.yudao.module.ip.controller.admin.article.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Schema(description = "管理后台 - 文章新增/修改 Request VO")
@Data
public class ArticleSaveReqVO {

    @Schema(description = "主键（修改时必填）")
    private Long id;

    @NotBlank(message = "标题不能为空")
    private String title;

    @NotBlank(message = "slug 不能为空")
    private String slug;

    private String coverUrl;
    private String summary;
    private String content;
    private String tags;
    private String category;

    @NotNull(message = "状态不能为空")
    private Integer status;

    private Boolean pinned;
}
