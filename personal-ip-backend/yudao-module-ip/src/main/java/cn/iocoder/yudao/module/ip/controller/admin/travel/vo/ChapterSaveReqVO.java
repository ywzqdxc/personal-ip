package cn.iocoder.yudao.module.ip.controller.admin.travel.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "管理后台 - 旅行章节新增/修改 Request VO")
@Data
public class ChapterSaveReqVO {

    @Schema(description = "主键（修改时必填）")
    private Long id;

    @Schema(description = "所属行程 ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "所属行程不能为空")
    private Long tripId;

    @Schema(description = "章节序号", requiredMode = Schema.RequiredMode.REQUIRED, example = "01")
    @NotBlank(message = "章节序号不能为空")
    private String num;

    @Schema(description = "章节名称", requiredMode = Schema.RequiredMode.REQUIRED, example = "BROMO")
    @NotBlank(message = "章节名称不能为空")
    private String name;

    private String chinese;
    private String dateLabel;
    private String region;
    private String country;
    private String area;
    private String coords;
    private String locationCn;
    private String time;
    private String tags;
    private String quote;
    private String caption;
    private String spots;
    private String coverImg;
    private String coverGrad;
    private String tintColor;
    private String bg;
    private String textColor;
    private String accent;
    private String pageNum;
    private String totalExp;
    private String contactSheet;
    private Integer sortOrder;
}
