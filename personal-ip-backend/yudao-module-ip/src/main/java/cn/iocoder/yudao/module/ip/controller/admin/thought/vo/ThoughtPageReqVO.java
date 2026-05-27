package cn.iocoder.yudao.module.ip.controller.admin.thought.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Schema(description = "管理后台 - 随想碎片分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class ThoughtPageReqVO extends PageParam {

    @Schema(description = "正文（模糊搜索）", example = "今天")
    private String content;

    @Schema(description = "心情标签", example = "开心")
    private String mood;

    @Schema(description = "状态 0草稿 1发布", example = "1")
    private Integer status;
}
