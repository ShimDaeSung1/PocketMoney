package com.web.pocketmoney.service.like;

import com.web.pocketmoney.dto.like.InsertLikeDTO;
import com.web.pocketmoney.entity.like.Like;
import com.web.pocketmoney.entity.like.LikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Log4j2
public class LikeServiceImpl implements LikeService{

    private final LikeRepository likeRepository;

    @Override
    public void insertLike(InsertLikeDTO insertLikeDTO) {
        Like like = dtoToEntity(insertLikeDTO);

        likeRepository.save(like);
    }
}
