package cn.iocoder.yudao.module.ip.controller.admin.thought.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Schema(description = "管理后台 - 随想碎片新增/修改 Request VO")
@Data
public class ThoughtSaveReqVO {

    @Schema(description = "主键（修改时必填）", example = "1")
    private Long id;

    @Schema(description = "正文", requiredMode = Schema.RequiredMode.REQUIRED, example = "今天写了个有趣的bug")
    @NotBlank(message = "正文不能为空")
    private String content;

    @Schema(description = "心情标签", example = "调试中")
    private String mood;

    @Schema(description = "标签，逗号分隔", example = "coding,fun")
    private String tags;

    @Schema(description = "可选配图")
    private String imageUrl;

    @Schema(description = "状态 0草稿 1发布", requiredMode = Schema.RequiredMode.REQUIRED, example = "0")
    @NotNull(message = "状态不能为空")
    private Integer status;
}
