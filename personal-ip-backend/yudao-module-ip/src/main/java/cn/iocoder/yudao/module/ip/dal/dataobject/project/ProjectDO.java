package cn.iocoder.yudao.module.ip.dal.dataobject.project;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 项目展示 DO
 */
@TableName("ip_project")
@KeySequence("ip_project_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDO extends BaseDO {

    /** 主键 */
    @TableId
    private Long id;

    /** 项目名称 */
    private String name;

    /** URL 标识，唯一 */
    private String slug;

    /** 简短描述 */
    private String description;

    /** 封面图 URL */
    private String coverUrl;

    /** 悬浮预览图 URL */
    private String previewUrl;

    /** GitHub 链接 */
    private String githubUrl;

    /** 演示链接 */
    private String demoUrl;

    /** 技术栈，逗号分隔 */
    private String techStack;

    /** Markdown 详情 */
    private String content;

    /** 排序权重 */
    private Integer sortOrder;

    /** 是否首页置顶 0否 1是 */
    private Boolean featured;

    /** 状态 0草稿 1发布 */
    private Integer status;
}
