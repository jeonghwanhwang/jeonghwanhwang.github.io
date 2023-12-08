import {MutableRefObject, useEffect, useMemo, useRef, useState} from 'react'
import { PostListItemType } from '../types/PostItem.types'

export type useInfiniteScrollType = {
    containerRef: MutableRefObject<HTMLDivElement | null>
    postList: PostListItemType[]
}

const NUMBER_OF_ITEMS_PER_PAGE = 10

const useInfiniteScroll = (
    selectedCategory: string,
    posts: PostListItemType[],
) => {
    const containerRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(
        null,
    );

    const [count, setCount] = useState<number>(1);

    const postListByCategory = useMemo<PostListItemType[]>(
        () =>
            posts.filter(({ node: { frontmatter: { categories } } }: PostListItemType) =>
                selectedCategory !== 'All'
                    ? categories.includes(selectedCategory)
                    : true,
            ),
        [selectedCategory],
    );

    const observer = useRef<IntersectionObserver | null>(null)

    observer.current = new IntersectionObserver(
        (entries, observer) => {
            if (!entries[0].isIntersecting) return;

            setCount(value => value + 1);
            observer.disconnect();
        },
    );

    useEffect(() => setCount(1), [selectedCategory])

    useEffect(() => {
        if (
            NUMBER_OF_ITEMS_PER_PAGE * count >= postListByCategory.length ||
            containerRef.current === null ||
            containerRef.current.children.length === 0
        )
            return

        if (observer && observer.current) {
            observer.current.observe(
                containerRef.current.children[containerRef.current.children.length - 1],
            )
        }

    }, [count, selectedCategory]);

    return {
        containerRef,
        postList: postListByCategory.slice(0, count * NUMBER_OF_ITEMS_PER_PAGE),
    };
}

export default useInfiniteScroll