package cn.iocoder.yudao.module.ip.controller.app.project;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.app.project.vo.AppProjectRespVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.project.ProjectDO;
import cn.iocoder.yudao.module.ip.service.project.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.annotation.security.PermitAll;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "用户 App - 项目展示")
@RestController
@RequestMapping("/ip/project")
@Validated
@PermitAll
public class AppProjectController {

    @Resource
    private ProjectService projectService;

    @GetMapping("/list")
    @Operation(summary = "获得项目列表（已发布，featured 优先）")
    public CommonResult<List<AppProjectRespVO>> getProjectList() {
        List<ProjectDO> list = projectService.getPublishedProjectList();
        return success(BeanUtils.toBean(list, AppProjectRespVO.class));
    }

    @GetMapping("/get")
    @Operation(summary = "根据 slug 获得项目详情")
    @Parameter(name = "slug", description = "项目 slug", required = true, example = "my-project")
    public CommonResult<AppProjectRespVO> getProjectBySlug(@RequestParam("slug") String slug) {
        ProjectDO project = projectService.getPublishedProjectBySlug(slug);
        if (project == null) {
            return success(null);
        }
        return success(BeanUtils.toBean(project, AppProjectRespVO.class));
    }
}
