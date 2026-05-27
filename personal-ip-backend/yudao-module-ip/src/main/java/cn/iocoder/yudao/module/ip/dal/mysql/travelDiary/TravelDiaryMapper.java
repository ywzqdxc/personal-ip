package cn.iocoder.yudao.module.ip.dal.mysql.travelDiary;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.travelDiary.vo.TravelDiaryPageReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travelDiary.TravelDiaryDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 旅行日记 Mapper
 */
@Mapper
public interface TravelDiaryMapper extends BaseMapperX<TravelDiaryDO> {

    default PageResult<TravelDiaryDO> selectPage(TravelDiaryPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<TravelDiaryDO>()
                .likeIfPresent(TravelDiaryDO::getTitle, reqVO.getTitle())
                .likeIfPresent(TravelDiaryDO::getDestination, reqVO.getDestination())
                .eqIfPresent(TravelDiaryDO::getStatus, reqVO.getStatus())
                .orderByAsc(TravelDiaryDO::getSortOrder)
                .orderByDesc(TravelDiaryDO::getTripDate));
    }

    default List<TravelDiaryDO> selectPublishedList() {
        return selectList(new LambdaQueryWrapperX<TravelDiaryDO>()
                .eq(TravelDiaryDO::getStatus, 1)
                .orderByAsc(TravelDiaryDO::getSortOrder)
                .orderByDesc(TravelDiaryDO::getTripDate));
    }

}
