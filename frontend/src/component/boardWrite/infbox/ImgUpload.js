import React, { useRef, useState } from "react";
import styled from "styled-components";

const UploadButton = styled.div`
  width: 150px;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  text-align: center;
  margin-right: 40px;
  margin-left: auto;
  cursor: pointer;
  background-color: rgb(24, 191, 230);
`;

function ImgUpload(props) {
  const ImgInput = useRef();
  const [uploading, setUploading] = useState(null);
  const onImgChange = (e) => {
    setUploading(true);
    props.setImageUrl(e.target.files[0]);
  };
  const onImgButtonClick = (e) => {
    ImgInput.current.click();
  };

  return (
    <>
      <input
        ref={ImgInput}
        type="file"
        accept="image/*"
        name="file"
        onChange={onImgChange}
        style={{ display: "none" }}
      />
      {uploading ? (
        <UploadButton onClick={onImgButtonClick} style={{ fontSize: "40px" }}>
          ✔
        </UploadButton>
      ) : (
        <UploadButton onClick={onImgButtonClick}>사진 업로드</UploadButton>
      )}
    </>
  );
}

export default ImgUpload;
