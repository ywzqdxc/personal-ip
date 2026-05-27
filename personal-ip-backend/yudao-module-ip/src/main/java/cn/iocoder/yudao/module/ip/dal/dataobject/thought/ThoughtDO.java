package cn.iocoder.yudao.module.ip.dal.dataobject.thought;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 随想碎片 DO
 */
@TableName("ip_thought")
@KeySequence("ip_thought_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThoughtDO extends BaseDO {

    @TableId
    private Long id;

    /** 正文 */
    private String content;

    /** 心情标签 */
    private String mood;

    /** 标签，逗号分隔 */
    private String tags;

    /** 可选配图 */
    private String imageUrl;

    /** 状态 0草稿 1发布 */
    private Integer status;
}
