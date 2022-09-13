package com.web.pocketmoney.service.like;

import com.web.pocketmoney.dto.like.InsertLikeDTO;
import com.web.pocketmoney.dto.like.LikeDTO;
import com.web.pocketmoney.entity.like.Like;
import com.web.pocketmoney.entity.user.User;

public interface LikeService {

    void insertLike(InsertLikeDTO insertLikeDTO);

    //채팅방 삽입시에 자동으로 생성되는것 이므로 like는 항상false
    default Like dtoToEntity(InsertLikeDTO insertLikeDTO){
        //자신의 아이디
        User me = User.builder()
                .id(insertLikeDTO.getUserId())
                .build();

        User likedUser = User.builder()
                .id(insertLikeDTO.getLikedId())
                .build();

        Like like = Like.builder()
                .userId(me)
                .likedId(likedUser)
                .like(false)
                .build();

        return like;
    }

    default LikeDTO entityToDTO(Like like){

        LikeDTO likeDTO = LikeDTO.builder()
                .likeId(like.getLikedId().getId())
                .like(like.isLike())
                .build();

        return likeDTO;
    }
}
