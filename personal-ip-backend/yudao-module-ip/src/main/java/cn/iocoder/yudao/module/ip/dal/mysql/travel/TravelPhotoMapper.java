package cn.iocoder.yudao.module.ip.dal.mysql.travel;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelPhotoDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TravelPhotoMapper extends BaseMapperX<TravelPhotoDO> {

    default List<TravelPhotoDO> selectByChapterId(Long chapterId) {
        return selectList(new LambdaQueryWrapperX<TravelPhotoDO>()
                .eq(TravelPhotoDO::getChapterId, chapterId)
                .orderByAsc(TravelPhotoDO::getSortOrder));
    }

    default void deleteByChapterId(Long chapterId) {
        delete(new LambdaQueryWrapperX<TravelPhotoDO>()
                .eq(TravelPhotoDO::getChapterId, chapterId));
    }
}
