package cn.iocoder.yudao.module.ip.controller.app.travelDiary.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "用户 App - 旅行日记 Response VO")
@Data
public class AppTravelDiaryRespVO {

    @Schema(description = "主键", example = "1")
    private Long id;

    @Schema(description = "章节标题", example = "巴厘岛 · 水之诗")
    private String title;

    @Schema(description = "目的地", example = "Bali, Indonesia")
    private String destination;

    @Schema(description = "旅行日期")
    private LocalDate tripDate;

    @Schema(description = "封面图 URL")
    private String coverUrl;

    @Schema(description = "章节主题色，如 #FF6B35", example = "#FF6B35")
    private String accentColor;

    @Schema(description = "Markdown 正文")
    private String content;

    @Schema(description = "图片 URL 数组（JSON 字符串）", example = "[\"url1\",\"url2\"]")
    private String photos;

    @Schema(description = "章节排序")
    private Integer sortOrder;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
