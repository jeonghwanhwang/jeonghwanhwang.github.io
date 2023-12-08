import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import {GatsbyImage, IGatsbyImageData} from "gatsby-plugin-image";

type ProfileImageProps = {
    profileImage: IGatsbyImageData
}

const PROFILE_IMAGE_LINK =
    'https://i.pinimg.com/736x/df/29/f6/df29f6d29043422a21fa616e68f294e9.jpg'

const ProfileImageWrapper = styled(GatsbyImage)`
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`

const ProfileImage: FunctionComponent<ProfileImageProps> = ({
                                             profileImage
                                         }) => {
    return <ProfileImageWrapper image={profileImage} alt="Profile Image" />
}

export default ProfileImage