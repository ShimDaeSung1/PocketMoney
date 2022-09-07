package com.web.pocketmoney.entity.user;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    User findByNickName(String nickName);
  //  Optional<User> findById(String id);

    Optional<User> findById(Long id);


  //  Optional<User> findById(Long id);


    //PK로 유저 정보 하나 갖고오기
//    @Query("select u from User u where u.id = :id")
//    Object[] getUserById(@Param("id") Long id);

//    @Query("select u from User u where u.Oauth = :Oauth and u.email = :email")
//    Optional<User> findByEmail(@Param("email") String email, @Param("Oauth") String Oauth);

//    카인드 스코어  +1 하기
    @Transactional // Update, Delete문은 붙여줘야함
    @Modifying
    @Query("update User u set u.kindScore = u.kindScore + 1 " +
            " where u.id = :userId")
    void plusKindScore(@Param("userId") Long userId);

    // 카인드 스코어 -1 하기
    @Transactional // Update, Delete문은 붙여줘야함
    @Modifying // select 문이 아님을 나타냄
    @Query("update User u set u.kindScore = u.kindScore -1 " +
            " where u.id = :userId")
    void minusKindScore(@Param("userId") Long userId);

}
