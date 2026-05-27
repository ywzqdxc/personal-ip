package cn.iocoder.yudao.module.ip.service.project;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.project.vo.ProjectPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.project.vo.ProjectSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.project.ProjectDO;
import cn.iocoder.yudao.module.ip.dal.mysql.project.ProjectMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.ip.enums.ErrorCodeConstants.PROJECT_NOT_EXISTS;

/**
 * 项目展示 Service 实现
 */
@Service
@Validated
public class ProjectServiceImpl implements ProjectService {

    @Resource
    private ProjectMapper projectMapper;

    @Override
    public Long createProject(ProjectSaveReqVO createReqVO) {
        ProjectDO project = BeanUtils.toBean(createReqVO, ProjectDO.class);
        projectMapper.insert(project);
        return project.getId();
    }

    @Override
    public void updateProject(ProjectSaveReqVO updateReqVO) {
        validateProjectExists(updateReqVO.getId());
        ProjectDO updateObj = BeanUtils.toBean(updateReqVO, ProjectDO.class);
        projectMapper.updateById(updateObj);
    }

    @Override
    public void deleteProject(Long id) {
        validateProjectExists(id);
        projectMapper.deleteById(id);
    }

    @Override
    public ProjectDO getProject(Long id) {
        return projectMapper.selectById(id);
    }

    @Override
    public PageResult<ProjectDO> getProjectPage(ProjectPageReqVO pageReqVO) {
        return projectMapper.selectPage(pageReqVO);
    }

    @Override
    public List<ProjectDO> getPublishedProjectList() {
        return projectMapper.selectList(new LambdaQueryWrapperX<ProjectDO>()
                .eq(ProjectDO::getStatus, 1)
                .orderByDesc(ProjectDO::getFeatured)
                .orderByDesc(ProjectDO::getSortOrder));
    }

    @Override
    public ProjectDO getPublishedProjectBySlug(String slug) {
        return projectMapper.selectOne(new LambdaQueryWrapperX<ProjectDO>()
                .eq(ProjectDO::getSlug, slug)
                .eq(ProjectDO::getStatus, 1));
    }

    private void validateProjectExists(Long id) {
        if (projectMapper.selectById(id) == null) {
            throw exception(PROJECT_NOT_EXISTS);
        }
    }
}
