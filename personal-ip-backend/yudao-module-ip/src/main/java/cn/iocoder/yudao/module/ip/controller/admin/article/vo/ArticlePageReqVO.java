package cn.iocoder.yudao.module.ip.controller.admin.article.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Schema(description = "管理后台 - 文章分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class ArticlePageReqVO extends PageParam {

    @Schema(description = "标题（模糊搜索）")
    private String title;

    @Schema(description = "分类")
    private String category;

    @Schema(description = "状态 0草稿 1发布", example = "1")
    private Integer status;
}
