package cn.iocoder.yudao.module.ip.controller.admin.travel.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Schema(description = "管理后台 - 旅行行程分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class TripPageReqVO extends PageParam {

    @Schema(description = "年份", example = "2026")
    private Integer year;

    @Schema(description = "标题（模糊搜索）", example = "BALI")
    private String title;

    @Schema(description = "状态 0草稿 1发布", example = "1")
    private Integer status;
}
