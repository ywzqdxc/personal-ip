package cn.iocoder.yudao.module.ip.controller.admin.team.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(description = "管理后台 - 团队成员新增/修改 Request VO")
@Data
public class TeamMemberSaveReqVO {

    private Long id;

    @NotBlank(message = "姓名不能为空")
    private String name;

    private String role;
    private String avatarUrl;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private Integer sortOrder;
    private Integer status;
}
