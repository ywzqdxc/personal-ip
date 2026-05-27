package cn.iocoder.yudao.module.ip.controller.admin.thought.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - 随想碎片 Response VO")
@Data
public class ThoughtRespVO {

    @Schema(description = "主键", example = "1")
    private Long id;

    @Schema(description = "正文")
    private String content;

    @Schema(description = "心情标签")
    private String mood;

    @Schema(description = "标签，逗号分隔")
    private String tags;

    @Schema(description = "可选配图")
    private String imageUrl;

    @Schema(description = "状态 0草稿 1发布")
    private Integer status;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
