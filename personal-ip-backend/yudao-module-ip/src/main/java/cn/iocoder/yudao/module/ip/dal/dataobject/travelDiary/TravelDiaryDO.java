package cn.iocoder.yudao.module.ip.dal.dataobject.travelDiary;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDate;

/**
 * 旅行日记 DO
 */
@TableName("ip_travel_diary")
@KeySequence("ip_travel_diary_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelDiaryDO extends BaseDO {

    /** 主键 */
    @TableId
    private Long id;

    /** 章节标题 */
    private String title;

    /** 目的地 */
    private String destination;

    /** 旅行日期 */
    private LocalDate tripDate;

    /** 封面图 URL */
    private String coverUrl;

    /** 章节主题色，如 #FF6B35 */
    private String accentColor;

    /** Markdown 正文 */
    private String content;

    /** 图片 URL 数组（JSON 字符串） */
    private String photos;

    /** 章节排序 */
    private Integer sortOrder;

    /** 状态 0草稿 1发布 */
    private Integer status;
}
