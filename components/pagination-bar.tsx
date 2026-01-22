"use client";

import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PER_PAGE_DEFAULT } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { BasicSelect, BasicSelectItem } from "./basic-select";

const PAGE_SIZE_OPTIONS: BasicSelectItem[] = [1, 10, 20, 50, 100].map(
  (num) => ({
    label: num.toString(),
    value: num.toString(),
  }),
);

export function PaginationBar({
  total = 0,
  page = 1,
  size = PER_PAGE_DEFAULT,
}: {
  total?: number;
  page?: number;
  size?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (values: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      values.forEach(({ name, value }) => {
        params.set(name, value);
      });

      return params.toString();
    },
    [searchParams],
  );

  const createPageLinkString = useCallback(
    (page: number) => {
      return (
        pathname +
        "?" +
        createQueryString([{ name: "page", value: page.toString() }])
      );
    },
    [pathname],
  );

  const handlePageSizeChange = (value: string) => {
    const queryString =
      pathname +
      "?" +
      createQueryString([
        {
          name: "perPage",
          value: value,
        },
        {
          name: "page",
          value: "1",
        },
      ]);

    router.push(queryString);
  };

  const { pages, isFirstPage, isLastPage, nextPage, prevPage, lastPage } =
    useMemo(() => {
      const pages: number[] = [];
      const lastPage = Math.max(Math.ceil(total / size), 1);
      const isFirstPage = page === 1;
      const isLastPage = page === lastPage;
      const prevPage = Math.max(page, page - 1);
      const nextPage = Math.min(lastPage, page + 1);

      const delta = isFirstPage || isLastPage ? 2 : 1;
      const startPage = Math.max(1, page - delta);
      const endPage = Math.min(lastPage, page + delta);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return { pages, isFirstPage, isLastPage, nextPage, lastPage, prevPage };
    }, [page, total, size]);

  return (
    <div className="flex items-center justify-end">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              href={createPageLinkString(1)}
              disabled={isFirstPage}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href={createPageLinkString(prevPage)}
              disabled={isFirstPage}
            />
          </PaginationItem>
          {pages.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={pageNumber == page}
                href={createPageLinkString(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              disabled={isLastPage}
              href={createPageLinkString(nextPage)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              disabled={isLastPage}
              href={createPageLinkString(lastPage)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div>
        <BasicSelect
          items={PAGE_SIZE_OPTIONS}
          value={size ? size.toString() : PER_PAGE_DEFAULT.toString()}
          onValueChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
