package cn.iocoder.yudao.module.ip.service.travel;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.TripPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.TripSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelTripDO;
import cn.iocoder.yudao.module.ip.dal.mysql.travel.TravelTripMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.ip.enums.ErrorCodeConstants.TRAVEL_TRIP_NOT_EXISTS;

@Service
@Validated
public class TravelTripServiceImpl implements TravelTripService {

    @Resource
    private TravelTripMapper tripMapper;

    @Override
    public Long createTrip(TripSaveReqVO createReqVO) {
        TravelTripDO trip = BeanUtils.toBean(createReqVO, TravelTripDO.class);
        tripMapper.insert(trip);
        return trip.getId();
    }

    @Override
    public void updateTrip(TripSaveReqVO updateReqVO) {
        validateTripExists(updateReqVO.getId());
        TravelTripDO updateObj = BeanUtils.toBean(updateReqVO, TravelTripDO.class);
        tripMapper.updateById(updateObj);
    }

    @Override
    public void deleteTrip(Long id) {
        validateTripExists(id);
        tripMapper.deleteById(id);
    }

    @Override
    public TravelTripDO getTrip(Long id) {
        return tripMapper.selectById(id);
    }

    @Override
    public PageResult<TravelTripDO> getTripPage(TripPageReqVO pageReqVO) {
        return tripMapper.selectPage(pageReqVO);
    }

    @Override
    public List<TravelTripDO> getPublishedTrips() {
        return tripMapper.selectList(new LambdaQueryWrapperX<TravelTripDO>()
                .eq(TravelTripDO::getStatus, 1)
                .orderByDesc(TravelTripDO::getYear)
                .orderByAsc(TravelTripDO::getSortOrder));
    }

    @Override
    public TravelTripDO getPublishedTripByYear(Long year, String tripId) {
        return tripMapper.selectOne(new LambdaQueryWrapperX<TravelTripDO>()
                .eq(TravelTripDO::getYear, year)
                .eq(TravelTripDO::getId, tripId)
                .eq(TravelTripDO::getStatus, 1));
    }

    private void validateTripExists(Long id) {
        if (tripMapper.selectById(id) == null) {
            throw exception(TRAVEL_TRIP_NOT_EXISTS);
        }
    }
}
