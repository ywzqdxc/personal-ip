package cn.iocoder.yudao.module.ip.dal.dataobject.travel;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 旅行行程 DO
 */
@TableName("ip_travel_trip")
@KeySequence("ip_travel_trip_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelTripDO extends BaseDO {

    @TableId
    private Long id;

    private Integer year;
    private String title;
    private String titleYear;
    private String subtitle;
    private String chinese;
    private String tagline;
    private String filmLabel;
    private String filmHeader;
    private String devCredit;
    private String sideText;
    private String coverImg;
    private String accentColor;
    private Integer sortOrder;
    private Integer status;
}
