package cn.iocoder.yudao.module.ip.dal.dataobject.travel;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 旅行章节照片 DO
 */
@TableName("ip_travel_photo")
@KeySequence("ip_travel_photo_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelPhotoDO extends BaseDO {

    @TableId
    private Long id;

    private Long chapterId;
    private String url;
    private Integer sortOrder;
}
