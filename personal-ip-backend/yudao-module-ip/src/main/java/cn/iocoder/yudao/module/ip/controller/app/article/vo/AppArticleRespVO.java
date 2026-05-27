package cn.iocoder.yudao.module.ip.controller.app.article.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Schema(description = "用户 App - 文章 Response VO")
@Data
public class AppArticleRespVO {

    private Long id;
    private String title;
    private String slug;
    private String coverUrl;
    private String summary;
    private String content;
    private String tags;
    private String category;
    private Boolean pinned;
    private Integer viewCount;
    private LocalDateTime createTime;
}
