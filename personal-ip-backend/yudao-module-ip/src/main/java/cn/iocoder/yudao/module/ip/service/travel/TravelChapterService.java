package cn.iocoder.yudao.module.ip.service.travel;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.ChapterPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.ChapterSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelChapterDO;
import jakarta.validation.Valid;

import java.util.List;

public interface TravelChapterService {

    Long createChapter(@Valid ChapterSaveReqVO createReqVO);

    void updateChapter(@Valid ChapterSaveReqVO updateReqVO);

    void deleteChapter(Long id);

    TravelChapterDO getChapter(Long id);

    PageResult<TravelChapterDO> getChapterPage(ChapterPageReqVO pageReqVO);

    List<TravelChapterDO> getPublishedChaptersByTripId(Long tripId);
}
