package cn.iocoder.yudao.module.ip.service.travel;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.TripPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.TripSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelTripDO;
import jakarta.validation.Valid;

import java.util.List;

public interface TravelTripService {

    Long createTrip(@Valid TripSaveReqVO createReqVO);

    void updateTrip(@Valid TripSaveReqVO updateReqVO);

    void deleteTrip(Long id);

    TravelTripDO getTrip(Long id);

    PageResult<TravelTripDO> getTripPage(TripPageReqVO pageReqVO);

    List<TravelTripDO> getPublishedTrips();

    TravelTripDO getPublishedTripByYear(Long year, String tripId);
}
