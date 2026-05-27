package cn.iocoder.yudao.module.ip.controller.admin.travel.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "管理后台 - 旅行行程新增/修改 Request VO")
@Data
public class TripSaveReqVO {

    @Schema(description = "主键（修改时必填）", example = "1")
    private Long id;

    @Schema(description = "年份", requiredMode = Schema.RequiredMode.REQUIRED, example = "2026")
    @NotNull(message = "年份不能为空")
    private Integer year;

    @Schema(description = "主标题", requiredMode = Schema.RequiredMode.REQUIRED, example = "BALI")
    @NotBlank(message = "主标题不能为空")
    private String title;

    @Schema(description = "年份标题", example = "2026")
    private String titleYear;

    @Schema(description = "副标题")
    private String subtitle;

    @Schema(description = "中文标题")
    private String chinese;

    @Schema(description = "标语")
    private String tagline;

    @Schema(description = "胶片标签说明")
    private String filmLabel;

    @Schema(description = "右侧页眉")
    private String filmHeader;

    @Schema(description = "显影信息")
    private String devCredit;

    @Schema(description = "侧面旋转文字")
    private String sideText;

    @Schema(description = "封面图 URL")
    private String coverImg;

    @Schema(description = "强调色")
    private String accentColor;

    @Schema(description = "排序权重")
    private Integer sortOrder;

    @Schema(description = "状态 0草稿 1发布", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "状态不能为空")
    private Integer status;
}
