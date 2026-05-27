package cn.iocoder.yudao.module.ip.controller.app.thought;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.app.thought.vo.AppThoughtRespVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.thought.ThoughtDO;
import cn.iocoder.yudao.module.ip.service.thought.ThoughtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.annotation.security.PermitAll;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "用户 App - 随想碎片")
@RestController
@RequestMapping("/ip/thought")
@Validated
@PermitAll
public class AppThoughtController {

    @Resource
    private ThoughtService thoughtService;

    @GetMapping("/page")
    @Operation(summary = "获得随想分页列表（已发布）")
    @Parameter(name = "pageNo", description = "页码", example = "1")
    @Parameter(name = "pageSize", description = "每页条数", example = "20")
    public CommonResult<List<AppThoughtRespVO>> getPublishedThoughtList(
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        List<ThoughtDO> list = thoughtService.getPublishedThoughtList(pageNo, pageSize);
        return success(BeanUtils.toBean(list, AppThoughtRespVO.class));
    }
}
