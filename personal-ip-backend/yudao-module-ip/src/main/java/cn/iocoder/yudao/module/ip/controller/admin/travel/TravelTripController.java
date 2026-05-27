package cn.iocoder.yudao.module.ip.controller.admin.travel;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.TripPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.TripRespVO;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.TripSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelTripDO;
import cn.iocoder.yudao.module.ip.service.travel.TravelTripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 旅行行程")
@RestController
@RequestMapping("/ip/travel/trip")
@Validated
public class TravelTripController {

    @Resource
    private TravelTripService tripService;

    @PostMapping("/create")
    @Operation(summary = "创建旅行行程")
    @PreAuthorize("@ss.hasPermission('ip:travel-trip:create')")
    public CommonResult<Long> createTrip(@Valid @RequestBody TripSaveReqVO createReqVO) {
        return success(tripService.createTrip(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新旅行行程")
    @PreAuthorize("@ss.hasPermission('ip:travel-trip:update')")
    public CommonResult<Boolean> updateTrip(@Valid @RequestBody TripSaveReqVO updateReqVO) {
        tripService.updateTrip(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除旅行行程")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('ip:travel-trip:delete')")
    public CommonResult<Boolean> deleteTrip(@RequestParam("id") Long id) {
        tripService.deleteTrip(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得旅行行程")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('ip:travel-trip:query')")
    public CommonResult<TripRespVO> getTrip(@RequestParam("id") Long id) {
        TravelTripDO trip = tripService.getTrip(id);
        return success(BeanUtils.toBean(trip, TripRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获得旅行行程分页")
    @PreAuthorize("@ss.hasPermission('ip:travel-trip:query')")
    public CommonResult<PageResult<TripRespVO>> getTripPage(@Valid TripPageReqVO pageReqVO) {
        PageResult<TravelTripDO> pageResult = tripService.getTripPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, TripRespVO.class));
    }
}
