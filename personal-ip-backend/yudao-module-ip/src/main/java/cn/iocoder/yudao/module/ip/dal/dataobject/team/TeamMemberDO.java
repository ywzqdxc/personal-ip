package cn.iocoder.yudao.module.ip.dal.dataobject.team;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

@TableName("ip_team_member")
@KeySequence("ip_team_member_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberDO extends BaseDO {

    @TableId
    private Long id;
    private String name;
    private String role;
    private String avatarUrl;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private Integer sortOrder;
    private Integer status;
}
