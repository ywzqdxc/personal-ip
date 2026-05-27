package cn.iocoder.yudao.module.ip.dal.mysql.team;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.team.vo.TeamMemberPageReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.team.TeamMemberDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TeamMemberMapper extends BaseMapperX<TeamMemberDO> {

    default PageResult<TeamMemberDO> selectPage(TeamMemberPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<TeamMemberDO>()
                .likeIfPresent(TeamMemberDO::getName, reqVO.getName())
                .eqIfPresent(TeamMemberDO::getStatus, reqVO.getStatus())
                .orderByAsc(TeamMemberDO::getSortOrder));
    }
}
