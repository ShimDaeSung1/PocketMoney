package com.web.pocketmoney.entity.wish;

import com.web.pocketmoney.entity.board.Board;
import com.web.pocketmoney.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.Optional;

public interface WishRepository extends JpaRepository<Wish, Long> {

    // 내 관심 구인글 목록 + 게시판 제목 같이 가져오기
    @Query("select w, b.title" +
            " from Wish w left join Board b on b.id = w" +
            " where w.userId = : userId")
    Object getWishByUserId(@Param("userId") Long userId);

    @Query("select w from Wish w where w.userId.id = :userId and w.boardId.id = :boardId")
    Optional<Wish> findByUserIdAndBoardId(@Param("userId") Long userId, @Param("boardId") Long boardId);

    @Query("select w from Wish w where w.userId = :userId and w.boardId = :boardId")
    Optional<Wish> findByUserIdAndBoardId2(@Param("userId") User userId, @Param("boardId") Board boardId);

//    @Query("select w, b.title, u.email " +
//            " from Wish w left join Board b on b.id = w" +
//            " left join User u" +
//            " where w.userId = :userId")
//    Page<Object[]> getListPage(Pageable pageable, @Param("userId") Long userId);

    @Query("select w, b, u" +
            " from Wish w left join Board b on b.id = w.boardId" +
            " left join User u on u.id = w.userId" +
            " where w.userId = :userId")
    Page<Object[]> getListPage(Pageable pageable, @Param("userId") User userId);

//    @Query("select rb, m, count(rbc) " +
//            " from ReviewBoard rb left join Member m on m.member_id = rb " +/            " left join ReviewBoardComment rbc on rbc.reviewBoard = rb" +
//            " where rb.review_id = :review_id")
//    Object getReviewBoardByReview_id(@Param("review_id") Long review_id);

//    @Query("select w, b.title, u.email " +
//            " from Wish w" +
//            " left join Board b on b.id = w" +
//            " left join User u on u.id = w.writeId" +

//            " where w.userId = : userId")
//    Page<Object[]> getListPage(Pageable pageable);

}
