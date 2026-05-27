package cn.iocoder.yudao.module.ip.dal.mysql.project;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.ip.controller.admin.project.vo.ProjectPageReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.project.ProjectDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 项目展示 Mapper
 */
@Mapper
public interface ProjectMapper extends BaseMapperX<ProjectDO> {

    default PageResult<ProjectDO> selectPage(ProjectPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<ProjectDO>()
                .likeIfPresent(ProjectDO::getName, reqVO.getName())
                .eqIfPresent(ProjectDO::getStatus, reqVO.getStatus())
                .orderByDesc(ProjectDO::getId));
    }
}
