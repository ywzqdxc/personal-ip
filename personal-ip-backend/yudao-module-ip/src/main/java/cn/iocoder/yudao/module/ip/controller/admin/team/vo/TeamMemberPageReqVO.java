package cn.iocoder.yudao.module.ip.controller.admin.team.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Schema(description = "管理后台 - 团队成员分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class TeamMemberPageReqVO extends PageParam {

    @Schema(description = "姓名（模糊搜索）")
    private String name;

    @Schema(description = "状态 0隐藏 1显示")
    private Integer status;
}
