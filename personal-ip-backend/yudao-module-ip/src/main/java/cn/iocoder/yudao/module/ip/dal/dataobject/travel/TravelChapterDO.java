package cn.iocoder.yudao.module.ip.dal.dataobject.travel;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 旅行章节 DO
 */
@TableName("ip_travel_chapter")
@KeySequence("ip_travel_chapter_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelChapterDO extends BaseDO {

    @TableId
    private Long id;

    private Long tripId;
    private String num;
    private String name;
    private String chinese;
    private String dateLabel;
    private String region;
    private String country;
    private String area;
    private String coords;
    private String locationCn;
    private String time;
    private String tags;
    private String quote;
    private String caption;
    private String spots;
    private String coverImg;
    private String coverGrad;
    private String tintColor;
    private String bg;
    private String textColor;
    private String accent;
    private String pageNum;
    private String totalExp;
    private String contactSheet;
    private Integer sortOrder;
}
