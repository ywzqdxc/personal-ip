package cn.iocoder.yudao.module.ip.controller.app.thought.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "用户 App - 随想碎片 Response VO")
@Data
public class AppThoughtRespVO {

    @Schema(description = "主键", example = "1")
    private Long id;

    @Schema(description = "正文", example = "今天写了个有趣的bug")
    private String content;

    @Schema(description = "心情标签", example = "调试中")
    private String mood;

    @Schema(description = "标签，逗号分隔", example = "coding,fun")
    private String tags;

    @Schema(description = "可选配图")
    private String imageUrl;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
