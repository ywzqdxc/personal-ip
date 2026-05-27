package cn.iocoder.yudao.module.ip.dal.mysql.travel;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.travel.vo.ChapterPageReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelChapterDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TravelChapterMapper extends BaseMapperX<TravelChapterDO> {

    default PageResult<TravelChapterDO> selectPage(ChapterPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<TravelChapterDO>()
                .eqIfPresent(TravelChapterDO::getTripId, reqVO.getTripId())
                .likeIfPresent(TravelChapterDO::getName, reqVO.getName())
                .orderByAsc(TravelChapterDO::getSortOrder)
                .orderByAsc(TravelChapterDO::getId));
    }
}
