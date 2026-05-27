package cn.iocoder.yudao.module.ip.dal.dataobject.article;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 文章 DO
 */
@TableName("ip_article")
@KeySequence("ip_article_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDO extends BaseDO {

    @TableId
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
}
