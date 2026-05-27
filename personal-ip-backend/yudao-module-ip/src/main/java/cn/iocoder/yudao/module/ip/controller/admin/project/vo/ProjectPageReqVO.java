package cn.iocoder.yudao.module.ip.controller.admin.project.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Schema(description = "管理后台 - 项目展示分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class ProjectPageReqVO extends PageParam {

    @Schema(description = "项目名称（模糊搜索）", example = "个人网站")
    private String name;

    @Schema(description = "状态 0草稿 1发布", example = "1")
    private Integer status;
}
