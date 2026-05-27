package cn.iocoder.yudao.module.ip.dal.mysql.thought;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.thought.vo.ThoughtPageReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.thought.ThoughtDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 随想碎片 Mapper
 */
@Mapper
public interface ThoughtMapper extends BaseMapperX<ThoughtDO> {

    default PageResult<ThoughtDO> selectPage(ThoughtPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<ThoughtDO>()
                .likeIfPresent(ThoughtDO::getContent, reqVO.getContent())
                .likeIfPresent(ThoughtDO::getMood, reqVO.getMood())
                .eqIfPresent(ThoughtDO::getStatus, reqVO.getStatus())
                .orderByDesc(ThoughtDO::getCreateTime));
    }
}
