package cn.iocoder.yudao.module.ip.controller.admin.thought;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.admin.thought.vo.ThoughtPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.thought.vo.ThoughtRespVO;
import cn.iocoder.yudao.module.ip.controller.admin.thought.vo.ThoughtSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.thought.ThoughtDO;
import cn.iocoder.yudao.module.ip.service.thought.ThoughtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 随想碎片")
@RestController
@RequestMapping("/ip/thought")
@Validated
public class ThoughtController {

    @Resource
    private ThoughtService thoughtService;

    @PostMapping("/create")
    @Operation(summary = "创建随想碎片")
    @PreAuthorize("@ss.hasPermission('ip:thought:create')")
    public CommonResult<Long> createThought(@Valid @RequestBody ThoughtSaveReqVO createReqVO) {
        return success(thoughtService.createThought(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新随想碎片")
    @PreAuthorize("@ss.hasPermission('ip:thought:update')")
    public CommonResult<Boolean> updateThought(@Valid @RequestBody ThoughtSaveReqVO updateReqVO) {
        thoughtService.updateThought(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除随想碎片")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('ip:thought:delete')")
    public CommonResult<Boolean> deleteThought(@RequestParam("id") Long id) {
        thoughtService.deleteThought(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得随想碎片")
    @Parameter(name = "id", description = "编号", required = true, example = "1")
    @PreAuthorize("@ss.hasPermission('ip:thought:query')")
    public CommonResult<ThoughtRespVO> getThought(@RequestParam("id") Long id) {
        ThoughtDO thought = thoughtService.getThought(id);
        return success(BeanUtils.toBean(thought, ThoughtRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获得随想碎片分页")
    @PreAuthorize("@ss.hasPermission('ip:thought:query')")
    public CommonResult<PageResult<ThoughtRespVO>> getThoughtPage(@Valid ThoughtPageReqVO pageReqVO) {
        PageResult<ThoughtDO> pageResult = thoughtService.getThoughtPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, ThoughtRespVO.class));
    }
}
