package cn.iocoder.yudao.module.ip.controller.admin.team.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Schema(description = "管理后台 - 团队成员 Response VO")
@Data
public class TeamMemberRespVO {
    private Long id;
    private String name;
    private String role;
    private String avatarUrl;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private Integer sortOrder;
    private Integer status;
    private LocalDateTime createTime;
}
