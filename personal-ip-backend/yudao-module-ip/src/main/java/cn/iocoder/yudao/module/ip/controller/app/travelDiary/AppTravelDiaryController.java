package cn.iocoder.yudao.module.ip.controller.app.travelDiary;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.app.travelDiary.vo.AppTravelDiaryRespVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travelDiary.TravelDiaryDO;
import cn.iocoder.yudao.module.ip.service.travelDiary.TravelDiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.annotation.security.PermitAll;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "用户 App - 旅行日记")
@RestController
@RequestMapping("/ip/travel-diary")
@Validated
@PermitAll
public class AppTravelDiaryController {

    @Resource
    private TravelDiaryService travelDiaryService;

    @GetMapping("/list")
    @Operation(summary = "获得旅行日记列表（已发布，按 sort_order 排序）")
    public CommonResult<List<AppTravelDiaryRespVO>> getTravelDiaryList() {
        List<TravelDiaryDO> list = travelDiaryService.getPublishedTravelDiaryList();
        return success(BeanUtils.toBean(list, AppTravelDiaryRespVO.class));
    }

    @GetMapping("/get")
    @Operation(summary = "根据 id 获得旅行日记详情")
    @Parameter(name = "id", description = "日记编号", required = true, example = "1")
    public CommonResult<AppTravelDiaryRespVO> getTravelDiary(@RequestParam("id") Long id) {
        TravelDiaryDO travelDiary = travelDiaryService.getPublishedTravelDiary(id);
        if (travelDiary == null) {
            return success(null);
        }
        return success(BeanUtils.toBean(travelDiary, AppTravelDiaryRespVO.class));
    }
}
