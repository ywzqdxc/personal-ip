package cn.iocoder.yudao.module.ip.service.travel;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.ChapterPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.ChapterSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelChapterDO;
import cn.iocoder.yudao.module.ip.dal.mysql.travel.TravelChapterMapper;
import cn.iocoder.yudao.module.ip.dal.mysql.travel.TravelPhotoMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.ip.enums.ErrorCodeConstants.TRAVEL_CHAPTER_NOT_EXISTS;

@Service
@Validated
public class TravelChapterServiceImpl implements TravelChapterService {

    @Resource
    private TravelChapterMapper chapterMapper;

    @Resource
    private TravelPhotoMapper photoMapper;

    @Override
    public Long createChapter(ChapterSaveReqVO createReqVO) {
        TravelChapterDO chapter = BeanUtils.toBean(createReqVO, TravelChapterDO.class);
        chapterMapper.insert(chapter);
        return chapter.getId();
    }

    @Override
    public void updateChapter(ChapterSaveReqVO updateReqVO) {
        validateChapterExists(updateReqVO.getId());
        TravelChapterDO updateObj = BeanUtils.toBean(updateReqVO, TravelChapterDO.class);
        chapterMapper.updateById(updateObj);
    }

    @Override
    @Transactional
    public void deleteChapter(Long id) {
        validateChapterExists(id);
        photoMapper.deleteByChapterId(id);
        chapterMapper.deleteById(id);
    }

    @Override
    public TravelChapterDO getChapter(Long id) {
        return chapterMapper.selectById(id);
    }

    @Override
    public PageResult<TravelChapterDO> getChapterPage(ChapterPageReqVO pageReqVO) {
        return chapterMapper.selectPage(pageReqVO);
    }

    @Override
    public List<TravelChapterDO> getPublishedChaptersByTripId(Long tripId) {
        return chapterMapper.selectList(new LambdaQueryWrapperX<TravelChapterDO>()
                .eq(TravelChapterDO::getTripId, tripId)
                .orderByAsc(TravelChapterDO::getSortOrder)
                .orderByAsc(TravelChapterDO::getNum));
    }

    private void validateChapterExists(Long id) {
        if (chapterMapper.selectById(id) == null) {
            throw exception(TRAVEL_CHAPTER_NOT_EXISTS);
        }
    }
}
