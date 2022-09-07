package com.web.pocketmoney.service.board;

import com.web.pocketmoney.dto.UserState;
import com.web.pocketmoney.dto.aws.S3UploadResponseDto;
import com.web.pocketmoney.dto.board.*;
import com.web.pocketmoney.entity.board.Board;
import com.web.pocketmoney.entity.board.BoardRepository;
import com.web.pocketmoney.entity.user.User;
import com.web.pocketmoney.entity.wish.Wish;
import com.web.pocketmoney.entity.wish.WishRepository;
import com.web.pocketmoney.exception.*;
import com.web.pocketmoney.exception.handler.ErrorCode;
import com.web.pocketmoney.service.aws.S3Delete;
import com.web.pocketmoney.service.aws.S3Uploader;
import com.web.pocketmoney.vo.CriteriaVo;
import com.web.pocketmoney.vo.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.bytebuddy.asm.Advice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.Multipart;
import java.io.IOException;
import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class BoardService {
    private final BoardRepository boardRepository;
    private final WishRepository wishRepository;
    private final S3Delete s3Delete;
    private final S3Uploader s3Uploader;

    @Transactional
    public BoardResponseDto save(User user, BoardRequestDto dto, MultipartFile file) throws IOException {
        log.info(1);
        LocalDateTime dateTime = checkDate(dto.getDate());
        checkPay(dto.getPay());
        S3UploadResponseDto s3Dto = new S3UploadResponseDto(null, null);
        if(file != null) {
            S3UploadResponseDto tmp = s3Uploader.uploadFiles(file, "board", user);
            s3Dto.setKey(tmp.getKey());
            s3Dto.setPath(tmp.getPath());
            log.info("tmp : " + tmp.getKey() + " " + tmp.getPath());
            log.info("s3 : " + s3Dto.getKey() + " " + s3Dto.getPath());
        }

        boardRepository.save(Board.builder()
                        .area(dto.getArea())
                        .content(dto.getContent())
                        .dayOfWeek(dto.getDayOfWeek())
                        .user(user)
                        .title(dto.getTitle())
                        .pay(Integer.parseInt(dto.getPay()))
                        .wantedTime(dateTime)
                        .fileKey(s3Dto.getKey())
                        .filePath(s3Dto.getPath())
                .build()
        );

        return BoardResponseDto.builder()
                .nickName(user.getNickName())
                .area(dto.getArea())
                .pay(Integer.parseInt(dto.getPay()))
                .dayOfWeek(dto.getDayOfWeek())
                .title(dto.getTitle())
                .content(dto.getContent())
                .date(dateTime)
                .fileKey(s3Dto.getKey())
                .filePath(s3Dto.getPath())
                 .build();
    }

    @Transactional
    public BoardResponseDto update(User user, BoardRequestDto dto, Long id, MultipartFile file) throws IOException {
        Board board = boardRepository.findById(id).orElseThrow(CBoardIdFailedException::new);
        if(user.getId() != board.getUser().getId()) {
            throw new CNotSameUserException();
        }
        LocalDateTime dateTime = checkDate(dto.getDate());
        checkPay(dto.getPay());

        board.setArea(dto.getArea());
        board.setContent(dto.getContent());
        board.setDayOfWeek(dto.getDayOfWeek());
        board.setPay(Integer.parseInt(dto.getPay()));
        board.setTitle(dto.getTitle());
        board.setWantedTime(dateTime);
        String nickName = user.getNickName();

        if(file != null) {
            s3Delete.boardImageDelete(user, board.getFileKey());
            S3UploadResponseDto s3 = s3Uploader.uploadFiles(file, "board", user);
            board.setFileKey(s3.getKey());
            board.setFilePath(s3.getPath());
        }
        boardRepository.save(board);

        return BoardResponseDto.builder()
                .nickName(nickName)
                .area(dto.getArea())
                .date(dateTime)
                .title(dto.getTitle())
                .content(dto.getContent())
                .dayOfWeek(dto.getDayOfWeek())
                .pay(Integer.parseInt(dto.getPay()))
                .fileKey(board.getFileKey())
                .filePath(board.getFilePath())
                .build();
    }

    @Transactional
    public Long delete(User user, Long id)
    {
        Board board = boardRepository.findById(id).orElseThrow(CBoardIdFailedException::new);
        if(user.getId() != board.getUser().getId()) {
            throw new CNotSameUserException();
        }
        s3Delete.boardImageDelete(user, board.getFileKey());
        boardRepository.delete(board);

        return id;
    }

    @Transactional
    public BoardDto postOne(User user, Long id)
    {
        Board board = boardRepository.findById(id).orElseThrow(CBoardIdFailedException::new);
        boardRepository.updateView(id);

        int isUser;
        boolean wish = false;
        UserState state;
        if(user == null) {
            state = UserState.NOLOGIN;
        }
        else if(user.getId() != board.getUser().getId()) {
            Wish isWish = wishRepository.findByUserIdAndBoardId(user.getId(), board.getId()).orElse(null);
            if(isWish != null) {
                wish = true;
            }
            state = UserState.NOTUSER;
        }
        else {
            state = UserState.USER;
            Wish isWish = wishRepository.findByUserIdAndBoardId(user.getId(), board.getId()).orElse(null);
            if(isWish != null) {
                wish = true;
            }
        }
        return BoardDto.builder()
                .dayOfWeek(board.getDayOfWeek())
                .content(board.getContent())
                .title(board.getTitle())
                .date(board.getWantedTime())
                .area(board.getArea())
                .nickName(board.getUser().getNickName())
                .pay(board.getPay())
                .view(board.getView())
                .area(board.getArea())
                .isUser(state)
                .filePath(board.getFilePath())
                .wish(wish)
        .build();
    }

    @Transactional
    public BoardResponseListDto boardList(User user, int num)
    {
        List<Board> boards = boardRepository.findAll(Sort.by(Sort.Direction.DESC, "createTime"));
        if(boards == null) {
            return new BoardResponseListDto(null, 1,1, false, false);
        }

       int total = boards.size();
       log.info("total : " + total);
       PageVo page = new PageVo(new CriteriaVo(num,10, total), total);

       List<BoardListDto> bd = new ArrayList<>();
       for(int i=page.getCri().getStart(); i<=page.getCri().getEnd(); i++) {
           Boolean w = false;
           if(user!=null) {
               Wish wish = wishRepository.findByUserIdAndBoardId(user.getId(), boards.get(i).getId()).orElse(null);
               if(wish != null) {
                   w = true;
               }
           }
           bd.add(new BoardListDto(boards.get(i).getTitle(),
                   boards.get(i).getView(), boards.get(i).getCreateTime(), boards.get(i).getArea(),
                   boards.get(i).getPay(), boards.get(i).getId(), boards.get(i).getWantedTime(),w, boards.get(i).getFilePath()));
       }
       return new BoardResponseListDto(bd,page.getStartPage(), page.getEndPage(), page.isPrev(), page.isNext());
    }

    @Transactional
    public BoardResponseListDto boardSearchList(User user, String str, int num)
    {
        log.info("search list " + str);
        List<Board> boards = (List<Board>) boardRepository.searchBoards(str);
        if(boards == null) {
            return new BoardResponseListDto(null, 1,1, false, false);
        }

        int total = boards.size();
        log.info("total : " + total);
        PageVo page = new PageVo(new CriteriaVo(num,10, total), total);
        int start = page.getStartPage();
        int end = page.getEndPage();

        List<BoardListDto> bd = new ArrayList<>();
        for(int i=page.getCri().getStart(); i<=page.getCri().getEnd(); i++) {
            Boolean w = false;
            if(user!=null) {
                Wish wish = wishRepository.findByUserIdAndBoardId(user.getId(), boards.get(i).getId()).orElse(null);
                if(wish != null) {
                    w = true;
                }
            }
            bd.add(new BoardListDto(boards.get(i).getTitle(),
                    boards.get(i).getView(), boards.get(i).getCreateTime(), boards.get(i).getArea(),
                    boards.get(i).getPay(), boards.get(i).getId(), boards.get(i).getWantedTime(),w, boards.get(i).getFilePath()));
        }
        BoardResponseListDto boardResponseListDto = new BoardResponseListDto(bd, start, end, page.isPrev(), page.isNext());
        return boardResponseListDto;
    }

    @Transactional
    public BoardResponseListDto boardSearchListByCity(User user, String str, int num)
    {
        log.info("search list");
        List<Board> boards = (List<Board>) boardRepository.searchBoardByArea(str);
        if(boards == null) {
            return new BoardResponseListDto(null, 1,1, false, false);
        }

        int total = boards.size();
        log.info("total : " + total);
        PageVo page = new PageVo(new CriteriaVo(num,10, total), total);

        int start = page.getStartPage();
        int end = page.getEndPage();

        List<BoardListDto> bd = new ArrayList<>();
        for(int i=page.getCri().getStart(); i<=page.getCri().getEnd(); i++) {
            Boolean w = false;
            if(user!=null) {
                Wish wish = wishRepository.findByUserIdAndBoardId(user.getId(), boards.get(i).getId()).orElse(null);
                if(wish != null) {
                    w = true;
                }
            }
            bd.add(new BoardListDto(boards.get(i).getTitle(),
                    boards.get(i).getView(), boards.get(i).getCreateTime(), boards.get(i).getArea(),
                    boards.get(i).getPay(), boards.get(i).getId(), boards.get(i).getWantedTime(),w, boards.get(i).getFilePath()));
        }
        BoardResponseListDto boardResponseListDto = new BoardResponseListDto(bd, start, end, page.isPrev(), page.isNext());
        return boardResponseListDto;
    }

    public LocalDateTime checkDate(String[] dates) {
        int[] date = new int[5];

        LocalDateTime nowTime = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        int nowYear = nowTime.getYear();
        log.info(2);
        LocalDateTime dateTime;
        try {
            dateTime = LocalDateTime.of(Integer.parseInt(dates[0]), Integer.parseInt(dates[1]), Integer.parseInt(dates[2]), Integer.parseInt(dates[3]),Integer.parseInt(dates[4]), 0, 0);
        } catch(DateTimeException e) {
            throw new CNotRangeException("정확한 시간 형식이 아닙니다.");
        } catch(NumberFormatException e) {
            throw new CNotNumberException("날짜/시간은 정수형만 입력 가능합니다.");
        }
        log.info(3);

        if(nowTime.isAfter(dateTime)) {
            throw new CNotRangeException("과거는 입력할 수 없습니다.");
        }

        return dateTime;
    }

    public void checkPay(String pay) {
        try {
            Integer.parseInt(pay);
        } catch(NumberFormatException e) {
            throw new CNotNumberException("시급은 정수형태만 입력이 가능합니다.");
        }
    }
}
