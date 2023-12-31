import React, {FunctionComponent, useMemo} from 'react'
import GlobalStyle from "../components/Common/GlobalStyle";
import styled from "@emotion/styled";
import Introduction from "../components/Main/Introduction";
import Footer from "../components/Common/Footer";
import CategoryList, {CategoryListProps} from "../components/Main/CategoryList";
import PostList from "../components/Main/PostList";
import {graphql} from "gatsby";
import {PostListItemType} from "../types/PostItem.types";
import {IGatsbyImageData} from "gatsby-plugin-image";
import queryString, { ParsedQuery } from 'query-string'
import Template from "../components/Common/Template";

type IndexPageProps = {
    location: {
        search: string
    }
    data: {
        allMarkdownRemark: {
            edges: PostListItemType[]
        }
        file: {
            childImageSharp: {
                gatsbyImageData: IGatsbyImageData
            }
        }
    }
}

const CATEGORY_LIST = {
    All: 5,
    Web: 3,
    Mobile: 2,
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const IndexPage: FunctionComponent<IndexPageProps> = ({
                                                          location: { search },
                                                          data: {
                                                              allMarkdownRemark: { edges },
                                                              file: {
                                                                  childImageSharp: { gatsbyImageData },
                                                              },
                                                          },
                                                      }) => {
    const parsed: ParsedQuery<string> = queryString.parse(search);
    const selectedCategory: string =
        typeof parsed.category !== 'string' || !parsed.category
            ? 'All'
            : parsed.category;

    const categoryList = useMemo(
        () =>
            edges.reduce(
                (
                    list: CategoryListProps['categoryList'],
                    {
                        node: {
                            frontmatter: { categories },
                        },
                    }: PostListItemType,
                ) => {
                    categories.forEach(category => {
                        if (list[category] === undefined) list[category] = 1;
                        else list[category]++;
                    });

                    list['All']++;

                    return list;
                },
                { All: 0 },
            ),
        [],
    );

    return (
        <Template>
            <Introduction profileImage={gatsbyImageData}/>
            <CategoryList selectedCategory={selectedCategory} categoryList={CATEGORY_LIST} />
            <PostList selectedCategory={selectedCategory} posts={edges}/>
        </Template>
    );
}

export default IndexPage

export const getPostList = graphql`
  query getPostList {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
          }
        }
      }
    }
    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
    }
  }
`