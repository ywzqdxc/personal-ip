package cn.iocoder.yudao.module.ip.controller.admin.travel;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.ChapterPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.ChapterRespVO;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.ChapterSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelChapterDO;
import cn.iocoder.yudao.module.ip.service.travel.TravelChapterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 旅行章节")
@RestController
@RequestMapping("/ip/travel/chapter")
@Validated
public class TravelChapterController {

    @Resource
    private TravelChapterService chapterService;

    @PostMapping("/create")
    @Operation(summary = "创建旅行章节")
    @PreAuthorize("@ss.hasPermission('ip:travel-chapter:create')")
    public CommonResult<Long> createChapter(@Valid @RequestBody ChapterSaveReqVO createReqVO) {
        return success(chapterService.createChapter(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新旅行章节")
    @PreAuthorize("@ss.hasPermission('ip:travel-chapter:update')")
    public CommonResult<Boolean> updateChapter(@Valid @RequestBody ChapterSaveReqVO updateReqVO) {
        chapterService.updateChapter(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除旅行章节")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('ip:travel-chapter:delete')")
    public CommonResult<Boolean> deleteChapter(@RequestParam("id") Long id) {
        chapterService.deleteChapter(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得旅行章节")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('ip:travel-chapter:query')")
    public CommonResult<ChapterRespVO> getChapter(@RequestParam("id") Long id) {
        TravelChapterDO chapter = chapterService.getChapter(id);
        return success(BeanUtils.toBean(chapter, ChapterRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获得旅行章节分页")
    @PreAuthorize("@ss.hasPermission('ip:travel-chapter:query')")
    public CommonResult<PageResult<ChapterRespVO>> getChapterPage(@Valid ChapterPageReqVO pageReqVO) {
        PageResult<TravelChapterDO> pageResult = chapterService.getChapterPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, ChapterRespVO.class));
    }
}
