import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import Template from "../components/Common/Template";
import {PostFrontmatterType} from "../types/PostItem.types";
import PostHead from "../components/Post/PostHead";
import PostContent from "../components/Post/PostContent";
import CommentWidget from "../components/Post/CommentWidget";

type PostTemplateProps = {
    data: {
        allMarkdownRemark: {
            edges: PostPageItemType[]
        }
    }
};

export type PostPageItemType = {
    node: {
        html: string
        frontmatter: PostFrontmatterType
    }
}

const PostTemplate: FunctionComponent<PostTemplateProps> = ({
    data: {
        allMarkdownRemark: { edges },
    },
                                                            }) => {
    const {
        node: {
            html,
            frontmatter: {
                title,
                summary, // 나중에 사용할 예정입니다!
                date,
                categories,
                thumbnail: {
                    childImageSharp: { gatsbyImageData },
                },
            },
        },
    } = edges[0]

    return (
        <Template>
            <PostHead
                title={title}
                date={date}
                categories={categories}
                thumbnail={gatsbyImageData}
            />
            <PostContent html={html} />
            <CommentWidget />
        </Template>
    )
};

export default PostTemplate;

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }
  }
`;