package cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Schema(description = "管理后台 - 旅行日记分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class TravelDiaryPageReqVO extends PageParam {

    @Schema(description = "章节标题（模糊搜索）", example = "巴厘岛")
    private String title;

    @Schema(description = "目的地（模糊搜索）", example = "Bali")
    private String destination;

    @Schema(description = "状态 0草稿 1发布", example = "1")
    private Integer status;
}
