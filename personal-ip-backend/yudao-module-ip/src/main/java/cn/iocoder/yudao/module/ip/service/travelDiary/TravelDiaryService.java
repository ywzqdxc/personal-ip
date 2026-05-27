package cn.iocoder.yudao.module.ip.service.travelDiary;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo.TravelDiaryPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo.TravelDiarySaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travelDiary.TravelDiaryDO;
import jakarta.validation.Valid;

import java.util.List;

/**
 * 旅行日记 Service 接口
 */
public interface TravelDiaryService {

    Long createTravelDiary(@Valid TravelDiarySaveReqVO createReqVO);

    void updateTravelDiary(@Valid TravelDiarySaveReqVO updateReqVO);

    void deleteTravelDiary(Long id);

    TravelDiaryDO getTravelDiary(Long id);

    PageResult<TravelDiaryDO> getTravelDiaryPage(TravelDiaryPageReqVO pageReqVO);

    /** 获得已发布的旅行日记列表，按 sort_order 升序 */
    List<TravelDiaryDO> getPublishedTravelDiaryList();

    /** 根据 id 获得已发布的旅行日记 */
    TravelDiaryDO getPublishedTravelDiary(Long id);
}
