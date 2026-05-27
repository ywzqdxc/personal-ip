package cn.iocoder.yudao.module.ip.service.travelDiary;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo.TravelDiaryPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo.TravelDiarySaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travelDiary.TravelDiaryDO;
import cn.iocoder.yudao.module.ip.dal.mysql.travelDiary.TravelDiaryMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.ip.enums.ErrorCodeConstants.TRAVEL_DIARY_NOT_EXISTS;

/**
 * 旅行日记 Service 实现
 */
@Service
@Validated
public class TravelDiaryServiceImpl implements TravelDiaryService {

    @Resource
    private TravelDiaryMapper travelDiaryMapper;

    @Override
    public Long createTravelDiary(TravelDiarySaveReqVO createReqVO) {
        TravelDiaryDO travelDiary = BeanUtils.toBean(createReqVO, TravelDiaryDO.class);
        travelDiaryMapper.insert(travelDiary);
        return travelDiary.getId();
    }

    @Override
    public void updateTravelDiary(TravelDiarySaveReqVO updateReqVO) {
        validateTravelDiaryExists(updateReqVO.getId());
        TravelDiaryDO updateObj = BeanUtils.toBean(updateReqVO, TravelDiaryDO.class);
        travelDiaryMapper.updateById(updateObj);
    }

    @Override
    public void deleteTravelDiary(Long id) {
        validateTravelDiaryExists(id);
        travelDiaryMapper.deleteById(id);
    }

    @Override
    public TravelDiaryDO getTravelDiary(Long id) {
        return travelDiaryMapper.selectById(id);
    }

    @Override
    public PageResult<TravelDiaryDO> getTravelDiaryPage(TravelDiaryPageReqVO pageReqVO) {
        return travelDiaryMapper.selectPage(pageReqVO);
    }

    @Override
    public List<TravelDiaryDO> getPublishedTravelDiaryList() {
        return travelDiaryMapper.selectList(new LambdaQueryWrapperX<TravelDiaryDO>()
                .eq(TravelDiaryDO::getStatus, 1)
                .orderByAsc(TravelDiaryDO::getSortOrder));
    }

    @Override
    public TravelDiaryDO getPublishedTravelDiary(Long id) {
        return travelDiaryMapper.selectOne(new LambdaQueryWrapperX<TravelDiaryDO>()
                .eq(TravelDiaryDO::getId, id)
                .eq(TravelDiaryDO::getStatus, 1));
    }

    private void validateTravelDiaryExists(Long id) {
        if (travelDiaryMapper.selectById(id) == null) {
            throw exception(TRAVEL_DIARY_NOT_EXISTS);
        }
    }
}
