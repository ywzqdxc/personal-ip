package cn.iocoder.yudao.module.ip.controller.admin.project;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.admin.project.vo.ProjectPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.project.vo.ProjectRespVO;
import cn.iocoder.yudao.module.ip.controller.admin.project.vo.ProjectSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.project.ProjectDO;
import cn.iocoder.yudao.module.ip.service.project.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 项目展示")
@RestController
@RequestMapping("/ip/project")
@Validated
public class ProjectController {

    @Resource
    private ProjectService projectService;

    @PostMapping("/create")
    @Operation(summary = "创建项目展示")
    @PreAuthorize("@ss.hasPermission('ip:project:create')")
    public CommonResult<Long> createProject(@Valid @RequestBody ProjectSaveReqVO createReqVO) {
        return success(projectService.createProject(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新项目展示")
    @PreAuthorize("@ss.hasPermission('ip:project:update')")
    public CommonResult<Boolean> updateProject(@Valid @RequestBody ProjectSaveReqVO updateReqVO) {
        projectService.updateProject(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除项目展示")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('ip:project:delete')")
    public CommonResult<Boolean> deleteProject(@RequestParam("id") Long id) {
        projectService.deleteProject(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得项目展示")
    @Parameter(name = "id", description = "编号", required = true, example = "1")
    @PreAuthorize("@ss.hasPermission('ip:project:query')")
    public CommonResult<ProjectRespVO> getProject(@RequestParam("id") Long id) {
        ProjectDO project = projectService.getProject(id);
        return success(BeanUtils.toBean(project, ProjectRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获得项目展示分页")
    @PreAuthorize("@ss.hasPermission('ip:project:query')")
    public CommonResult<PageResult<ProjectRespVO>> getProjectPage(@Valid ProjectPageReqVO pageReqVO) {
        PageResult<ProjectDO> pageResult = projectService.getProjectPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, ProjectRespVO.class));
    }
}
