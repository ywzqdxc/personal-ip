package cn.iocoder.yudao.module.ip.controller.admin.travel.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - 旅行行程 Response VO")
@Data
public class TripRespVO {

    @Schema(description = "主键")
    private Long id;

    private Integer year;
    private String title;
    private String titleYear;
    private String subtitle;
    private String chinese;
    private String tagline;
    private String filmLabel;
    private String filmHeader;
    private String devCredit;
    private String sideText;
    private String coverImg;
    private String accentColor;
    private Integer sortOrder;
    private Integer status;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
