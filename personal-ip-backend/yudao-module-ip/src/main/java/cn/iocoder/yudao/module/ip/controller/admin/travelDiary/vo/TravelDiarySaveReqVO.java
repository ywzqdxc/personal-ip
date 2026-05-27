package cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Schema(description = "管理后台 - 旅行日记新增/修改 Request VO")
@Data
public class TravelDiarySaveReqVO {

    @Schema(description = "主键（修改时必填）", example = "1")
    private Long id;

    @Schema(description = "章节标题", requiredMode = Schema.RequiredMode.REQUIRED, example = "巴厘岛 · 水之诗")
    @NotBlank(message = "章节标题不能为空")
    private String title;

    @Schema(description = "目的地", example = "Bali, Indonesia")
    private String destination;

    @Schema(description = "旅行日期", example = "2026-01-15")
    private LocalDate tripDate;

    @Schema(description = "封面图 URL")
    private String coverUrl;

    @Schema(description = "章节主题色，如 #FF6B35", example = "#FF6B35")
    private String accentColor;

    @Schema(description = "Markdown 正文")
    private String content;

    @Schema(description = "图片 URL 数组（JSON 字符串）", example = "[\"url1\",\"url2\"]")
    private String photos;

    @Schema(description = "章节排序", example = "0")
    private Integer sortOrder;

    @Schema(description = "状态 0草稿 1发布", requiredMode = Schema.RequiredMode.REQUIRED, example = "0")
    @NotNull(message = "状态不能为空")
    private Integer status;
}
