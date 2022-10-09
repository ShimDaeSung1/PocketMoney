package com.web.pocketmoney.service.room;

import com.web.pocketmoney.dto.chatRoom.ChatRoomDetailDto;
import com.web.pocketmoney.dto.chatRoom.ChatRoomListDto;
import com.web.pocketmoney.dto.chatRoom.ChatRoomRequestDto;
import com.web.pocketmoney.dto.chatRoom.ChatRoomSaveDto;
import com.web.pocketmoney.dto.like.InsertLikeDTO;
import com.web.pocketmoney.dto.message.MessageDetailDto;
import com.web.pocketmoney.entity.board.Board;
import com.web.pocketmoney.entity.board.BoardRepository;
//import com.web.pocketmoney.entity.like.Like;
//import com.web.pocketmoney.entity.like.LikeRepository;
import com.web.pocketmoney.entity.like.Good;
import com.web.pocketmoney.entity.like.GoodRepository;
import com.web.pocketmoney.entity.message.Message;
import com.web.pocketmoney.entity.message.MessageRepository;
import com.web.pocketmoney.entity.room.ChatRoom;
import com.web.pocketmoney.entity.room.ChatRoomRepository;
import com.web.pocketmoney.entity.user.User;
import com.web.pocketmoney.entity.user.UserRepository;
import com.web.pocketmoney.exception.*;
import com.web.pocketmoney.exception.handler.ErrorCode;
import com.web.pocketmoney.service.like.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Console;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository crr;
    private final MessageRepository cr;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final GoodRepository likeRepository;

    private final LikeService likeService;
    private final GoodRepository goodRepository;

    //채팅방 전체보기
    @Override
    public List<ChatRoomListDto> findAllRooms(Long userId) {
        //현재 로그인한 자신 user
        User user = userRepository.findById(userId).orElseThrow(()->
                new CUserNotFoundException("해당 유저를 찾을 수 없습니다.", ErrorCode.FORBIDDEN));

        log.info("userId :: "+ user.getId());

        List<ChatRoom> chatRoomEntityList = crr.findAllByEmployeeOrEmployer(Sort.by(Sort.Direction.DESC, "id"), user);
//        log.info("chat room ss :: "+ chatRoomEntityList.get(0).getId());
//        log.info("chat room ss :: "+ chatRoomEntityList.get(1).getId()); // 다 잘 나옴
//        List<ChatRoomDetailDto> chatRoomList = new ArrayList<>();
//
//        for(ChatRoom c : chatRoomEntityList){
//            chatRoomList.add(ChatRoomDetailDto.toChatRoomDetailDto(c));
//        }
//        return chatRoomList;
        return chatRoomEntityList.stream().map(chatRoom ->
                entityToDto(chatRoom, user)).collect(Collectors.toList());
    }

    //채팅방 id로 채팅방 찾기
    @Override
    public ChatRoomDetailDto findRoomById(Long id, Long userId) {
        //chatId, 로그인한 사용자 아이디 순으로 받아옴

        ChatRoom chatRoom = crr.findById(id)
                .orElseThrow(() -> new ChatRoomNotFoundException(
                        "채팅방을 찾을 수 없습니다.", ErrorCode.FORBIDDEN
                ));


        log.info("chatRoom : asd" + chatRoom);
        Optional<ChatRoom> result = crr.findById(id);
        log.info("result : " + result);
        ChatRoom chatRoom1 = (ChatRoom) result.get();
        log.info("result.get : " + chatRoom1);

        List<Message> messages = new ArrayList<>();
        messages = result.get().getChatMessageList();

        if(chatRoom1.getEmployeeId() == null){
            User employer = userRepository.findById(chatRoom1.getEmployerId().getId()).orElseThrow(() -> new CUserNotFoundException(
                    "찾을 수 없는 사용자입니다.", ErrorCode.NOT_FOUND
            ));
            if (userId.equals(employer.getId())) {
                return entitiesToDetailDto(chatRoom1, messages, userId);
            }
        } else if (chatRoom1.getEmployerId() == null) {
            User employee = userRepository.findById(chatRoom1.getEmployeeId().getId()).orElseThrow(() -> new CUserNotFoundException(
                    "찾을 수 없는 사용자입니다. ", ErrorCode.NOT_FOUND
            ));
            if (userId.equals(employee.getId())) {
                return entitiesToDetailDto(chatRoom1, messages, userId);

            }
        }else{
            User employer = userRepository.findById(chatRoom1.getEmployerId().getId()).orElseThrow(() -> new CUserNotFoundException(
                    "찾을 수 없는 사용자입니다.", ErrorCode.NOT_FOUND
            ));
            User employee = userRepository.findById(chatRoom1.getEmployeeId().getId()).orElseThrow(() -> new CUserNotFoundException(
                    "찾을 수 없는 사용자입니다. ", ErrorCode.NOT_FOUND
            ));
            if (userId.equals(employee.getId()) || userId.equals(employer.getId())) {
                return entitiesToDetailDto(chatRoom1, messages, userId);

            } else {
                throw new ChatRoomNotFoundException("권한이 없습니다.", ErrorCode.FORBIDDEN);

            }
        }
        return null;
    }
    @Override
    @Transactional
    public void createRoom(ChatRoomRequestDto chatRoomRequestDto, Long userId) {

        Long boardId = chatRoomRequestDto.getBoardId();

        Board board = boardRepository.findById(boardId).orElseThrow(()->
                new CBoardNotFoundException("찾는 게시판이 없습니다.", ErrorCode.FORBIDDEN));

        User user = userRepository.findById(userId).orElseThrow(()->
                new CUserNotFoundException("찾는 유저가 없습니다.", ErrorCode.FORBIDDEN));
        log.info("ddd:" +crr.exists(user, board.getTitle(), board.getUser()));

        chatRoomRequestDto.setName(board.getTitle());

        if(crr.exists(user, board.getTitle(), board.getUser())){
            throw new ChatRoomExistsException("채팅방이 이미 존재합니다.", ErrorCode.CHATROOM_DUPLICATION);
        }

        ChatRoomSaveDto chatRoomSaveDto = ChatRoomSaveDto.builder()
                .employeeId(userId)
                .name(chatRoomRequestDto.getName())
                .employerId(board.getUser().getId())
                .build();

        //채팅방 개설시 서로가 좋아요를 아직 안 누른상태로 DB 삽입
        InsertLikeDTO insertLikeDTO = InsertLikeDTO.builder()
                .userId(chatRoomSaveDto.getEmployeeId())
                .likedId(chatRoomSaveDto.getEmployerId())
                .liked("false")
                .build();

        InsertLikeDTO insertLikeDTO1 = InsertLikeDTO.builder()
                .userId(chatRoomSaveDto.getEmployerId())
                .likedId(chatRoomSaveDto.getEmployeeId())
                .liked("false")
                .build();
        User likedId = board.getUser(); //게시판 주인, 상대방
        if(goodRepository.exists(likedId, user)){

        }else{
            likeService.insertLike(insertLikeDTO);
            likeService.insertLike(insertLikeDTO1);
        }

        ChatRoom chatRoom = chatRoomSaveDtoToEntity(chatRoomSaveDto);
        crr.save(chatRoom);
    }

    @Override
    public void deleteById(Long chatRoomId, Long userId) {

        ChatRoom chatRoom = crr.findById(chatRoomId).orElseThrow(()->
                new ChatRoomNotFoundException("해당 채팅방을 찾을 수 없습니다.", ErrorCode.NOT_FOUND));
        log.info("chatRoomEntity:"+chatRoom);
        if(chatRoom.getEmployeeId() == null && chatRoom.getEmployerId() == null){
            log.info("delete...."+chatRoomId);
            crr.deleteById(chatRoomId);
        }else{
            if(chatRoom.getEmployeeId().getId() == userId){
                crr.deleteEmployee(chatRoomId);
            }else if(chatRoom.getEmployerId().getId() == userId){
                crr.deleteEmployer(chatRoomId);
            }
        }
        log.info("logggg"+chatRoom.getEmployerId());
        log.info("logggg"+chatRoom.getEmployeeId());



    }



    //    @Override
//    public List<MessageDetailDto> findAllChatByRoomId(Long id) {
//        List<Message> messageEntityList = cr.findAllByChatRoom_RoomId(roomId);
//        List<MessageDetailDto> messageList = new ArrayList<>();
//
//        for(Message m : messageEntityList){
//            messageList.add(MessageDetailDto.toChatMessageDetailDto(m));
//        }
//        return messageList;
//    }
//채팅방 여러개 불러올 때
    ChatRoomListDto entityToDto(ChatRoom chatRoom, User user){
    //상대방 이름 뽑아내기
    String nickName;
    Long userId;
    ChatRoomListDto chatRoomListDto;
    //user는 현재 로그인 사용자
    //사용자 아이디가 구직자 아이디일경우, 상대방 닉네임은 구인자 닉네임
        if (!chatRoom.existsUser()){
            nickName = "퇴장한 사용자";
            userId = user.getId();//상대방 퇴장시 상대방 id도 내 id로 바꿔버림
        } else if (user.getId().equals(chatRoom.getEmployeeId().getId())){
            User user1 = userRepository.findById(chatRoom.getEmployerId().getId()).orElseThrow(()->
                    new CUserNotFoundException("해당 유저가 없습니다.", ErrorCode.FORBIDDEN));
            nickName = user1.getNickName();
            userId = user1.getId();
        } else {
            User user1 = userRepository.findById(chatRoom.getEmployeeId().getId()).orElseThrow(()->
                    new CUserNotFoundException("해당 유저가 없습니다.", ErrorCode.FORBIDDEN));
            nickName = user1.getNickName();
            userId = user1.getId();
        }




//    if (user.getId().equals(chatRoom.getEmployeeId().getId())) {
//        if (chatRoom.getEmployerId() == null){
//            nickName = "퇴장한 사용자";
//            userId = user.getId();//상대방 퇴장시 상대방 id도 내 id로 바꿔버림
//        }else{
//            User user1 = userRepository.findById(chatRoom.getEmployerId().getId()).orElseThrow(()->
//                    new CUserNotFoundException("해당 유저가 없습니다.", ErrorCode.FORBIDDEN));
//            nickName = user1.getNickName();
//            userId = user1.getId();
//        }
//    }else{
//        if (chatRoom.getEmployeeId() == null){
//            nickName = "퇴장한 사용자";
//            userId = user.getId();
//        }else{
//            User user1 = userRepository.findById(chatRoom.getEmployeeId().getId()).orElseThrow(()->
//                    new CUserNotFoundException("해당 유저가 없습니다.", ErrorCode.FORBIDDEN));
//            nickName = user1.getNickName();
//            userId = user1.getId();
//        }
//    }
    User likedId = userRepository.findById(userId)
            .orElseThrow(() -> new CUserNotFoundException(
                    "유저를 찾을 수 없습니다.", ErrorCode.NOT_FOUND
            ));
    User me = userRepository.findById(user.getId())
            .orElseThrow(() -> new CUserNotFoundException(
                    "유저를 찾을 수 없습니다.", ErrorCode.NOT_FOUND
            ));
    if(!(user.getId().equals(userId))){
        Good liked = likeRepository.findByMeAndLikedId(likedId, me)
                .orElseThrow(() ->
                        new CLikeNotFoundException("좋아요를 누를 권한이 없습니다.",ErrorCode.FORBIDDEN));
        chatRoomListDto = ChatRoomListDto.builder()
                .nickName(nickName)
                .id(chatRoom.getId())
                .regDate(chatRoom.getRegDate())
                .like(liked.getTrueOrFalse())
                .name(chatRoom.getRoomName())
                .userId(userId)
                .build();
    }else{
        chatRoomListDto = ChatRoomListDto.builder()
                .nickName(nickName)
                .id(chatRoom.getId())
                .regDate(chatRoom.getRegDate())
                .like("Unusalble")
                .name(chatRoom.getRoomName())
                .userId(userId)
                .build();
    }



    return chatRoomListDto;
}
    // 채팅방 하나 불러올 때, 메시지까지
    ChatRoomDetailDto entitiesToDetailDto(ChatRoom chatRoom, List<Message> messages, Long userId){
        String nickName;
        Long opponentId;
        Good liked = null;
        ChatRoomDetailDto chatRoomDetailDto;
        if(chatRoom.getEmployeeId() == null || chatRoom.getEmployerId() == null){
            nickName = "퇴장한 사용자";
            opponentId = userId;
        }
        else if (userId.equals(chatRoom.getEmployeeId().getId())) {
            User user1 = userRepository.findById(chatRoom.getEmployerId().getId()).orElseThrow(()->
                    new CUserNotFoundException("해당 유저를 찾을 수 없습니다.", ErrorCode.FORBIDDEN));
            nickName = user1.getNickName();
            opponentId = user1.getId();
            User opponent = userRepository.findById(opponentId).orElseThrow(() -> new CUserNotFoundException(
                    "유저를 찾을 수 없습니다.", ErrorCode.NOT_FOUND
            ));
            User me = userRepository.findById(userId).orElseThrow(() -> new CUserNotFoundException(
                    "유저를 찾을 수 없습니다.", ErrorCode.NOT_FOUND
            ));
            liked = likeRepository.findByMeAndLikedId(opponent, me)
                    .orElseThrow(() -> new CLikeNotFoundException("좋아요를 누를 권한이 없습니다.", ErrorCode.FORBIDDEN));
        }else{
            User user1 = userRepository.findById(chatRoom.getEmployeeId().getId()).orElseThrow(()->
                    new CUserNotFoundException("해당 유저를 찾을 수 없습니다.", ErrorCode.FORBIDDEN));
            nickName = user1.getNickName();
            opponentId = user1.getId();
            User opponent = userRepository.findById(opponentId).orElseThrow(() -> new CUserNotFoundException(
                    "유저를 찾을 수 없습니다.", ErrorCode.NOT_FOUND
            ));
            User me = userRepository.findById(userId).orElseThrow(() -> new CUserNotFoundException(
                    "유저를 찾을 수 없습니다.", ErrorCode.NOT_FOUND
            ));
            liked = likeRepository.findByMeAndLikedId(opponent, me)
                    .orElseThrow(() -> new CLikeNotFoundException("좋아요를 누를 권한이 없습니다.", ErrorCode.FORBIDDEN));
        }

        if (liked == null){
            chatRoomDetailDto = ChatRoomDetailDto.builder()
                    .id(chatRoom.getId())
                    .name(chatRoom.getRoomName())
                    .like(null)
                    .nickName(nickName)
                    .userId(opponentId)
                    .regDate(chatRoom.getRegDate())
                    .build();
        }else{
            chatRoomDetailDto = ChatRoomDetailDto.builder()
                    .id(chatRoom.getId())
                    .name(chatRoom.getRoomName())
                    .like(liked.getTrueOrFalse())
                    .nickName(nickName)
                    .userId(opponentId)
                    .regDate(chatRoom.getRegDate())
                    .build();
        }

//        User employee = User.builder()
//                .id(chatRoom.getEmployeeId().getId())
//                .build();
//
//        User employer = User.builder()
//                .id(chatRoom.getEmployerId().getId())
//                .build();



        List<MessageDetailDto> messageDetailDtoList = messages.stream().map(message -> {
            return MessageDetailDto.builder()
                    .messageId(message.getId())
                    .sendDate(message.getSendDate())
                    .chatRoomId(message.getChatRoom().getId())
                    .roomName(message.getChatRoom().getRoomName())
                    .writer(message.getWriterNickName())
                    .writerId(userRepository.findByNickName(message.getWriterNickName()).getId())
                    .myId(userId)
                    .message(message.getMessage())
                    .build();
        }).collect(Collectors.toList());

        chatRoomDetailDto.setMessageDetailDtoList(messageDetailDtoList);
        return chatRoomDetailDto;
    }

    @Override
    public List<ChatRoomListDto> searchRoom(Long userId ,String roomName) {

        User user = userRepository.findById(userId).orElseThrow(()->
                new CUserNotFoundException("유저를 찾을 수 없습니다.", ErrorCode.FORBIDDEN));

        List<ChatRoom> chatRoomList = crr.findByRoomNameContaining(Sort.by(Sort.Direction.DESC, "id"), roomName, user);

        return chatRoomList.stream().map(arr -> entityToDto(arr, user)).collect(Collectors.toList());
    }
}
