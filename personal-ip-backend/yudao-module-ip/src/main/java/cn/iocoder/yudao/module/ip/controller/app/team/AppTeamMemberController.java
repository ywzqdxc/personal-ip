package cn.iocoder.yudao.module.ip.controller.app.team;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.app.team.vo.AppTeamMemberRespVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.team.TeamMemberDO;
import cn.iocoder.yudao.module.ip.service.team.TeamMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.annotation.security.PermitAll;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "用户 App - 团队成员")
@RestController
@RequestMapping("/ip/team")
@Validated
@PermitAll
public class AppTeamMemberController {

    @Resource
    private TeamMemberService teamMemberService;

    @GetMapping("/list")
    @Operation(summary = "获得团队成员列表（已显示，按 sort_order 排序）")
    public CommonResult<List<AppTeamMemberRespVO>> list() {
        List<TeamMemberDO> list = teamMemberService.getPublishedList();
        return success(BeanUtils.toBean(list, AppTeamMemberRespVO.class));
    }
}
