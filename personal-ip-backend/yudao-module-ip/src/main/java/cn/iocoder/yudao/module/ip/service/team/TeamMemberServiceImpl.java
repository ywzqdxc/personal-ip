package cn.iocoder.yudao.module.ip.service.team;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.team.vo.TeamMemberPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.team.vo.TeamMemberSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.team.TeamMemberDO;
import cn.iocoder.yudao.module.ip.dal.mysql.team.TeamMemberMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;
import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.ip.enums.ErrorCodeConstants.TEAM_MEMBER_NOT_EXISTS;

@Service
public class TeamMemberServiceImpl implements TeamMemberService {

    @Resource
    private TeamMemberMapper mapper;

    @Override
    public Long create(TeamMemberSaveReqVO vo) {
        TeamMemberDO obj = BeanUtils.toBean(vo, TeamMemberDO.class);
        mapper.insert(obj);
        return obj.getId();
    }

    @Override
    public void update(TeamMemberSaveReqVO vo) {
        validate(vo.getId());
        mapper.updateById(BeanUtils.toBean(vo, TeamMemberDO.class));
    }

    @Override
    public void delete(Long id) {
        validate(id);
        mapper.deleteById(id);
    }

    @Override
    public TeamMemberDO get(Long id) {
        return mapper.selectById(id);
    }

    @Override
    public PageResult<TeamMemberDO> page(TeamMemberPageReqVO vo) {
        return mapper.selectPage(vo);
    }

    @Override
    public List<TeamMemberDO> getPublishedList() {
        return mapper.selectList(new LambdaQueryWrapperX<TeamMemberDO>()
                .eq(TeamMemberDO::getStatus, 1)
                .orderByAsc(TeamMemberDO::getSortOrder));
    }

    private void validate(Long id) {
        if (mapper.selectById(id) == null) throw exception(TEAM_MEMBER_NOT_EXISTS);
    }
}
