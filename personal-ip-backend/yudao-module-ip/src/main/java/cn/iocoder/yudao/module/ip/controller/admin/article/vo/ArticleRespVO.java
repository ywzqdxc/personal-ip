package cn.iocoder.yudao.module.ip.controller.admin.article.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Schema(description = "管理后台 - 文章 Response VO")
@Data
public class ArticleRespVO {

    private Long id;
    private String title;
    private String slug;
    private String coverUrl;
    private String summary;
    private String content;
    private String tags;
    private String category;
    private Integer status;
    private Boolean pinned;
    private Integer viewCount;
    private LocalDateTime createTime;
}
