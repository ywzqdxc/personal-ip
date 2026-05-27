package cn.iocoder.yudao.module.ip.dal.mysql.travel;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.TripPageReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelTripDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TravelTripMapper extends BaseMapperX<TravelTripDO> {

    default PageResult<TravelTripDO> selectPage(TripPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<TravelTripDO>()
                .eqIfPresent(TravelTripDO::getYear, reqVO.getYear())
                .likeIfPresent(TravelTripDO::getTitle, reqVO.getTitle())
                .eqIfPresent(TravelTripDO::getStatus, reqVO.getStatus())
                .orderByDesc(TravelTripDO::getYear)
                .orderByAsc(TravelTripDO::getSortOrder));
    }
}
