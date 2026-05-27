package cn.iocoder.yudao.module.ip.controller.admin.travel.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - 旅行章节 Response VO")
@Data
public class ChapterRespVO {

    private Long id;
    private Long tripId;
    private String num;
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

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
