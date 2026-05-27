package cn.iocoder.yudao.module.ip.controller.app.team.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "用户 App - 团队成员 Response VO")
@Data
public class AppTeamMemberRespVO {
    private Long id;
    private String name;
    private String role;
    private String avatarUrl;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
}
