package cn.iocoder.yudao.module.ip.controller.admin.travel.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Schema(description = "管理后台 - 旅行章节分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class ChapterPageReqVO extends PageParam {

    @Schema(description = "所属行程 ID")
    private Long tripId;

    @Schema(description = "章节名称（模糊搜索）")
    private String name;
}
