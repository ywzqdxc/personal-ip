package cn.iocoder.yudao.module.ip.controller.admin.travelDiary;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo.TravelDiaryPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo.TravelDiaryRespVO;
import cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo.TravelDiarySaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travelDiary.TravelDiaryDO;
import cn.iocoder.yudao.module.ip.service.travelDiary.TravelDiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 旅行日记")
@RestController
@RequestMapping("/ip/travel-diary")
@Validated
public class TravelDiaryController {

    @Resource
    private TravelDiaryService travelDiaryService;

    @PostMapping("/create")
    @Operation(summary = "创建旅行日记")
    @PreAuthorize("@ss.hasPermission('ip:travel-diary:create')")
    public CommonResult<Long> createTravelDiary(@Valid @RequestBody TravelDiarySaveReqVO createReqVO) {
        return success(travelDiaryService.createTravelDiary(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新旅行日记")
    @PreAuthorize("@ss.hasPermission('ip:travel-diary:update')")
    public CommonResult<Boolean> updateTravelDiary(@Valid @RequestBody TravelDiarySaveReqVO updateReqVO) {
        travelDiaryService.updateTravelDiary(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除旅行日记")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('ip:travel-diary:delete')")
    public CommonResult<Boolean> deleteTravelDiary(@RequestParam("id") Long id) {
        travelDiaryService.deleteTravelDiary(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得旅行日记")
    @Parameter(name = "id", description = "编号", required = true, example = "1")
    @PreAuthorize("@ss.hasPermission('ip:travel-diary:query')")
    public CommonResult<TravelDiaryRespVO> getTravelDiary(@RequestParam("id") Long id) {
        TravelDiaryDO travelDiary = travelDiaryService.getTravelDiary(id);
        return success(BeanUtils.toBean(travelDiary, TravelDiaryRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获得旅行日记分页")
    @PreAuthorize("@ss.hasPermission('ip:travel-diary:query')")
    public CommonResult<PageResult<TravelDiaryRespVO>> getTravelDiaryPage(@Valid TravelDiaryPageReqVO pageReqVO) {
        PageResult<TravelDiaryDO> pageResult = travelDiaryService.getTravelDiaryPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, TravelDiaryRespVO.class));
    }
}
