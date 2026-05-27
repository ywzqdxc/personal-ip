package cn.iocoder.yudao.module.ip.controller.admin.team;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.admin.team.vo.*;
import cn.iocoder.yudao.module.ip.dal.dataobject.team.TeamMemberDO;
import cn.iocoder.yudao.module.ip.service.team.TeamMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 团队成员")
@RestController
@RequestMapping("/ip/team")
@Validated
public class TeamMemberController {

    @Resource
    private TeamMemberService teamMemberService;

    @PostMapping("/create")
    @Operation(summary = "创建团队成员")
    @PreAuthorize("@ss.hasPermission('ip:team:create')")
    public CommonResult<Long> create(@Valid @RequestBody TeamMemberSaveReqVO vo) {
        return success(teamMemberService.create(vo));
    }

    @PutMapping("/update")
    @Operation(summary = "更新团队成员")
    @PreAuthorize("@ss.hasPermission('ip:team:update')")
    public CommonResult<Boolean> update(@Valid @RequestBody TeamMemberSaveReqVO vo) {
        teamMemberService.update(vo);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除团队成员")
    @PreAuthorize("@ss.hasPermission('ip:team:delete')")
    public CommonResult<Boolean> delete(@RequestParam("id") Long id) {
        teamMemberService.delete(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得团队成员")
    @PreAuthorize("@ss.hasPermission('ip:team:query')")
    public CommonResult<TeamMemberRespVO> get(@RequestParam("id") Long id) {
        return success(BeanUtils.toBean(teamMemberService.get(id), TeamMemberRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获得团队成员分页")
    @PreAuthorize("@ss.hasPermission('ip:team:query')")
    public CommonResult<PageResult<TeamMemberRespVO>> page(@Valid TeamMemberPageReqVO vo) {
        return success(BeanUtils.toBean(teamMemberService.page(vo), TeamMemberRespVO.class));
    }
}
